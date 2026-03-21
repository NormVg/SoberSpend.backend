from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import Client, create_client

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


def get_supabase_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise RuntimeError(
            "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY environment variables."
        )
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def verify_supabase_connection(client: Client) -> None:
    # A lightweight query validates credentials and confirms the required table exists.
    client.table("Users").select("id").limit(1).execute()


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
