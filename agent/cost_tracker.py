"""Model pricing table — the single source of truth for cost math.

Actual cost recording/tracking lives in agent/observability.py (record_llm_call), which
persists to the `llm_costs` SQLite table so spend survives restarts and can be queried by
day/stage via GET /support/analytics/costs. This file just holds the price list so both
observability.py and anything else that needs to estimate cost can share one number.
"""

MODEL_PRICING = {
    # per 1M tokens, USD
    # ── Groq ────────────────────────────────────────────
    "llama-3.3-70b-versatile": {"input": 0.59, "output": 0.79},
    "llama-3.1-8b-instant": {"input": 0.05, "output": 0.08},
    "mixtral-8x7b-32768": {"input": 0.27, "output": 0.27},
    "gemma2-9b-it": {"input": 0.08, "output": 0.08},
    # ── Google Gemini ───────────────────────────────────
    "gemini-2.0-flash": {"input": 0.075, "output": 0.30},
    "gemini-1.5-flash": {"input": 0.075, "output": 0.30},
    "gemini-1.5-pro": {"input": 1.25, "output": 5.00},
    "text-embedding-004": {"input": 0.0, "output": 0.0},
    # ── OpenAI / OpenRouter ─────────────────────────────
    "gpt-4o": {"input": 2.50, "output": 10.00},
    "gpt-4o-mini": {"input": 0.15, "output": 0.60},
    "openai/gpt-4o-mini": {"input": 0.15, "output": 0.60},
    # ── Anthropic ───────────────────────────────────────
    "claude-haiku-4-5-20251001": {"input": 0.80, "output": 4.00},
    "claude-sonnet-4-20250514": {"input": 3.00, "output": 15.00},
}
