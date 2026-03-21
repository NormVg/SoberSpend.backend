from __future__ import annotations

import base64
import json
import os
from datetime import datetime
from typing import Literal

import httpx
from pydantic import BaseModel, Field, ValidationError

from prompt_builder import build_system_prompt


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


def _get_ollama_config() -> tuple[str, str]:
    base_url = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
    model_name = os.getenv("OLLAMA_MODEL", "llava")
    return base_url.rstrip("/"), model_name


def _extract_json_text(content: object) -> str:
    if isinstance(content, str):
        return content.strip()

    if isinstance(content, list):
        chunks: list[str] = []
        for item in content:
            if isinstance(item, dict):
                if item.get("type") == "text" and isinstance(item.get("text"), str):
                    chunks.append(item["text"])
        return "\n".join(chunks).strip()

    return ""


def analyze_receipt_with_context(
    image_bytes: bytes,
    bad_habits_prompt: str,
    recent_transactions: list[TransactionContext],
    mime_type: str = "image/jpeg",
    model_name: str | None = None,
) -> RoastAnalysisResponse:
    base_url, default_model = _get_ollama_config()
    resolved_model = model_name or default_model
    transactions_context = _build_transactions_context(recent_transactions)
    system_prompt = build_system_prompt(
        bad_habits_prompt=bad_habits_prompt,
        transactions_context=transactions_context,
    )
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")

    json_contract_hint = (
        "Return only strict JSON with keys: total_spent (int), category (string), "
        "budget_status (safe|warning|danger), ai_roast (string)."
    )

    payload = {
        "model": resolved_model,
        "messages": [
            {
                "role": "user",
                "content": f"{system_prompt}\n\n{json_contract_hint}",
                "images": [image_b64],
            }
        ],
        "stream": False,
        "temperature": 0.7,
        "format": "json",
    }

    with httpx.Client(timeout=90.0) as client:
        response = client.post(
            f"{base_url}/api/chat",
            headers={"Content-Type": "application/json"},
            json=payload,
        )

    if response.status_code >= 400:
        raise GeminiServiceError(
            f"Ollama error {response.status_code}: {response.text}"
        )

    result = response.json()
    message = result.get("message") or {}
    raw_text = _extract_json_text(message.get("content"))

    if raw_text.startswith("```"):
        raw_text = raw_text.strip("`")
        raw_text = raw_text.replace("json\n", "", 1).strip()

    try:
        return RoastAnalysisResponse.model_validate(json.loads(raw_text))
    except (json.JSONDecodeError, ValidationError) as exc:
        raise GeminiServiceError(f"Ollama returned invalid structured output: {raw_text}") from exc
