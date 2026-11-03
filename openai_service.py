import os
import uuid
import time
from dotenv import load_dotenv
from chatbot_prompt import COURSEIQ_SYSTEM_PROMPT
from courseiq_kb import get_platform_answer
from educational_engine import generate_educational_answer

# Load .env file
load_dotenv()

# In-memory conversation store: conversation_id -> list of message dicts
_CONVERSATIONS = {}
MAX_HISTORY_MESSAGES = 10  # Keep last 10 messages for context

class OpenAIService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY", "")
        self.configured_model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        self.client = None

        if self.api_key:
            try:
                from openai import OpenAI
                # 5-second default timeout to keep UI snappy
                self.client = OpenAI(api_key=self.api_key, timeout=5.0)
            except Exception as e:
                print(f"[CourseIQ Assistant] Warning: Could not initialize OpenAI client: {e}")

    def get_or_create_conversation(self, conversation_id: str = None) -> str:
        """Ensure a valid conversation ID exists."""
        if not conversation_id or conversation_id not in _CONVERSATIONS:
            conversation_id = f"conv_{int(time.time())}_{uuid.uuid4().hex[:8]}"
            _CONVERSATIONS[conversation_id] = []
        return conversation_id

    def clear_conversation(self, conversation_id: str):
        """Reset messages for a given conversation."""
        if conversation_id in _CONVERSATIONS:
            _CONVERSATIONS[conversation_id] = []

    def get_history(self, conversation_id: str):
        """Retrieve sanitized message history."""
        return _CONVERSATIONS.get(conversation_id, [])

    def chat(self, message: str, conversation_id: str = None, current_page: str = "home") -> dict:
        """
        Process chat message with conversational context and page awareness.
        Uses OpenAI SDK, with fallback to CourseIQ Educational Knowledge Engine on quota or network limits.
        """
        message = message.strip()
        if not message:
            return {"success": False, "error": "Message cannot be empty."}

        if len(message) > 2000:
            return {"success": False, "error": "Message exceeds maximum allowed length of 2000 characters."}

        conv_id = self.get_or_create_conversation(conversation_id)
        history = _CONVERSATIONS[conv_id]

        # 1. Build Page-Aware System Message
        page_context_info = f"\nUser is currently viewing the '{current_page}' page of CourseIQ."
        full_system_prompt = COURSEIQ_SYSTEM_PROMPT + page_context_info

        # 2. Build Messages Payload for OpenAI
        messages_payload = [{"role": "system", "content": full_system_prompt}]
        for item in history[-MAX_HISTORY_MESSAGES:]:
            messages_payload.append({"role": item["role"], "content": item["content"]})
        messages_payload.append({"role": "user", "content": message})

        reply_text = None

        # 3. Try Calling OpenAI API
        if self.client and self.api_key:
            model_name = self.configured_model or "gpt-4o-mini"
            try:
                response = self.client.chat.completions.create(
                    model=model_name,
                    messages=messages_payload,
                    temperature=0.7,
                    max_tokens=900,
                    timeout=5.0
                )
                if response.choices and response.choices[0].message.content:
                    reply_text = response.choices[0].message.content.strip()
            except Exception as api_err:
                err_msg = str(api_err)
                print(f"[CourseIQ Assistant] OpenAI API notice with model {model_name}: {err_msg[:120]}")

        # 4. If OpenAI didn't respond (e.g. 429 Quota exhausted, timeout, offline, or key error),
        # use the CourseIQ Knowledge & Educational Fallback Engine
        if not reply_text:
            reply_text = self._generate_intelligent_fallback(message, current_page, history)

        # 5. Save exchange in conversation history
        history.append({"role": "user", "content": message})
        history.append({"role": "assistant", "content": reply_text})

        # Trim history to reasonable size
        if len(history) > 30:
            _CONVERSATIONS[conv_id] = history[-20:]

        return {
            "success": True,
            "reply": reply_text,
            "conversationId": conv_id
        }

    def _generate_intelligent_fallback(self, query: str, current_page: str, history: list) -> str:
        """
        Intelligent fallback providing direct, deliverable-driven answers for CourseIQ (Domain A),
        Educational/Technical concepts (Domain B), Project lists, Code, Comparisons, and Polite Redirections.
        """
        q = query.lower().strip()

        # 1. Out-of-Scope Detection (Celebrity gossip, lifestyle, cooking recipes, sports scores, etc.)
        unrelated_signals = [
            "gossip", "dating", "celebrity", "hollywood", "horoscope", "astrology",
            "relationship advice", "movie spoilers", "who won the game", "nba score", "ipl score",
            "recipe", "bake a cake", "cook a ", "fashion advice", "diet plan", "lottery"
        ]
        if any(w in q for w in unrelated_signals):
            return (
                "I'm CourseIQ Assistant! 👋\n\n"
                "I can help you explore CourseIQ, understand educational concepts, learn programming, and explore technology. Let's focus on something you'd like to learn!"
            )

        # 2. Check for CourseIQ Platform questions (Domain A)
        platform_ans = get_platform_answer(query, current_page)
        if platform_ans:
            return platform_ans

        # 3. Use Educational Engine for Domain B, Projects, Code, Comparisons, Follow-ups
        return generate_educational_answer(query, history=history, current_page=current_page)


# Global singleton
openai_service = OpenAIService()
