from __future__ import annotations

import json
import os
from datetime import datetime
from typing import Literal

from google import genai
from google.genai import types
from pydantic import BaseModel, Field, ValidationError


class TransactionContext(BaseModel):
    amount: int
    category: str
    timestamp: datetime | None = None


class RoastAnalysisResponse(BaseModel):
    total_spent: int = Field(ge=0)
    category: str = Field(min_length=1)
    budget_status: Literal["safe", "warning", "danger"]
    ai_roast: str = Field(min_length=1)


class GeminiServiceError(RuntimeError):
    pass


def _build_transactions_context(recent_transactions: list[TransactionContext]) -> str:
    if not recent_transactions:
        return "No prior transaction history available."

    lines: list[str] = []
    for tx in recent_transactions[:20]:
        time_text = tx.timestamp.isoformat() if tx.timestamp else "unknown-time"
        lines.append(f"- amount={tx.amount}, category={tx.category}, timestamp={time_text}")
    return "\n".join(lines)


def _build_system_prompt(bad_habits_prompt: str, recent_transactions: list[TransactionContext]) -> str:
    history = _build_transactions_context(recent_transactions)
    return f"""
You are SoberSpend AI, a harsh and sarcastic financial accountability coach.

Your job:
1) Read the uploaded receipt image and extract spending details.
2) Roast the user in a witty, aggressive style.
3) Personalize the roast using BOTH:
   - User's confessed bad habits
   - Their recent transaction history

User confessed bad habits:
{bad_habits_prompt}

Recent transaction history:
{history}

Output rules:
- Return JSON only.
- total_spent: integer amount from the current receipt.
- category: best category for this receipt (food, shopping, travel, etc.).
- budget_status: one of safe, warning, danger.
- ai_roast: 1-3 lines, sharp and funny, directly referencing bad habits and spending history.
- No hate speech or slurs.
- Do not include markdown.
""".strip()


def _get_genai_client() -> genai.Client:
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise GeminiServiceError("Missing GEMINI_API_KEY (or GOOGLE_API_KEY) environment variable.")
    return genai.Client(api_key=api_key)


def analyze_receipt_with_context(
    image_bytes: bytes,
    bad_habits_prompt: str,
    recent_transactions: list[TransactionContext],
    mime_type: str = "image/jpeg",
    model_name: str = "gemini-2.0-flash",
) -> RoastAnalysisResponse:
    client = _get_genai_client()
    system_prompt = _build_system_prompt(bad_habits_prompt, recent_transactions)

    response = client.models.generate_content(
        model=model_name,
        contents=[
            types.Part.from_text(text=system_prompt),
            types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=RoastAnalysisResponse,
            temperature=0.7,
        ),
    )

    parsed = getattr(response, "parsed", None)
    if isinstance(parsed, RoastAnalysisResponse):
        return parsed

    if isinstance(parsed, dict):
        return RoastAnalysisResponse.model_validate(parsed)

    raw_text = response.text or ""
    try:
        return RoastAnalysisResponse.model_validate(json.loads(raw_text))
    except (json.JSONDecodeError, ValidationError) as exc:
        raise GeminiServiceError(f"Gemini returned invalid structured output: {raw_text}") from exc
