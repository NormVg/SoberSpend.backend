from __future__ import annotations

import os

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from supabase import Client, create_client

from ai_service import (
    GeminiServiceError,
    TransactionContext,
    analyze_receipt_with_context,
)

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY", "")


app = FastAPI(title="SoberSpend Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase: Client | None = None


class OnboardingRequest(BaseModel):
    user_id: str = Field(min_length=1)
    bad_habits_prompt: str = Field(min_length=1)


def get_supabase_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise RuntimeError(
            "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY environment variables."
        )
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def verify_supabase_connection(client: Client) -> None:
    # A lightweight query validates credentials and confirms the required table exists.
    client.table("Users").select("id").limit(1).execute()


def get_db() -> Client:
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database client is not initialized.")
    return supabase


@app.on_event("startup")
def startup_event() -> None:
    global supabase
    supabase = get_supabase_client()
    verify_supabase_connection(supabase)


@app.get("/")
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "message": "SoberSpend backend is running.",
        "database": "supabase",
    }


@app.post("/api/onboarding")
def onboarding(payload: OnboardingRequest) -> dict[str, str]:
    db = get_db()

    db.table("Users").upsert(
        {
            "id": payload.user_id,
            "bad_habits_prompt": payload.bad_habits_prompt,
        },
        on_conflict="id",
    ).execute()

    return {"status": "success", "message": "Context saved."}


@app.post("/api/analyze-receipt")
async def analyze_receipt(
    file: UploadFile = File(...),
    user_id: str = Form(...),
) -> dict[str, object]:
    db = get_db()

    if not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required.")

    user_result = (
        db.table("Users")
        .select("id,bad_habits_prompt")
        .eq("id", user_id)
        .limit(1)
        .execute()
    )
    users = user_result.data or []
    if not users:
        raise HTTPException(status_code=404, detail="User not found. Complete onboarding first.")

    bad_habits_prompt = users[0]["bad_habits_prompt"]

    transactions_result = (
        db.table("Transactions")
        .select("amount,category,timestamp")
        .eq("user_id", user_id)
        .order("timestamp", desc=True)
        .limit(20)
        .execute()
    )
    tx_rows = transactions_result.data or []
    recent_transactions = [TransactionContext.model_validate(row) for row in tx_rows]

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        analysis = analyze_receipt_with_context(
            image_bytes=image_bytes,
            bad_habits_prompt=bad_habits_prompt,
            recent_transactions=recent_transactions,
            mime_type=file.content_type or "image/jpeg",
        )
    except GeminiServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    db.table("Transactions").insert(
        {
            "user_id": user_id,
            "amount": analysis.total_spent,
            "category": analysis.category,
        }
    ).execute()

    return {
        "status": "success",
        "data": analysis.model_dump(),
    }
