"""
CourseIQ Assistant - OpenAI Integration & Multidisciplinary Educational Service
Coordinates communication with OpenAI API and delegates to the Multidisciplinary
Educational Engine and CourseIQ Knowledge Base.
"""

import os
import uuid
import time
from dotenv import load_dotenv
from chatbot_prompt import COURSEIQ_SYSTEM_PROMPT
from courseiq_kb import get_platform_answer
from educational_engine import (
    generate_educational_answer,
    classify_content,
    is_greeting,
    get_greeting_response,
    STANDARD_REFUSAL_MESSAGE,
    SAFETY_REFUSAL_MESSAGE
)

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
        self.api_cooldown_until = 0  # Cooldown timestamp to prevent repeated lagging on quota exhaustion

        if self.api_key:
            try:
                from openai import OpenAI
                # 3-second timeout for responsive user experience
                self.client = OpenAI(api_key=self.api_key, timeout=3.0)
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
        Invokes OpenAI API, falling back to the Educational Knowledge Engine if the API encounters
        quota exhaustion, connection timeout, or offline conditions.
        """
        message = message.strip()
        if not message:
            return {"success": False, "error": "Message cannot be empty."}

        if len(message) > 2000:
            return {"success": False, "error": "Message exceeds maximum allowed length of 2000 characters."}

        conv_id = self.get_or_create_conversation(conversation_id)
        history = _CONVERSATIONS[conv_id]

        reply_text = None

        # 1. Greetings: Natural, friendly response (Never classified as an academic subject)
        if is_greeting(message):
            reply_text = get_greeting_response()

        # 2. CourseIQ Platform Questions: Direct platform answers from Knowledge Base
        if not reply_text:
            platform_ans = get_platform_answer(message, current_page)
            if platform_ans:
                reply_text = platform_ans

        # 3. Content Boundary Checks (Harmful or strictly Non-Educational)
        if not reply_text:
            category = classify_content(message)
            if category == "CATEGORY_D":
                reply_text = SAFETY_REFUSAL_MESSAGE
            elif category == "CATEGORY_C" and not history:
                reply_text = STANDARD_REFUSAL_MESSAGE

        # 4. Invoke OpenAI API for general educational, programming, and follow-up questions
        current_time = time.time()
        if not reply_text and self.client and self.api_key and current_time >= self.api_cooldown_until:
            page_context_info = f"\nUser is currently viewing the '{current_page}' page of CourseIQ."
            full_system_prompt = COURSEIQ_SYSTEM_PROMPT + page_context_info

            messages_payload = [{"role": "system", "content": full_system_prompt}]
            for item in history[-MAX_HISTORY_MESSAGES:]:
                messages_payload.append({"role": item["role"], "content": item["content"]})
            messages_payload.append({"role": "user", "content": message})

            model_name = self.configured_model or "gpt-4o-mini"
            try:
                print(f"[CourseIQ Assistant] Invoking OpenAI API ({model_name}) for: {message[:60]!r}")
                response = self.client.chat.completions.create(
                    model=model_name,
                    messages=messages_payload,
                    temperature=0.7,
                    max_tokens=900,
                    timeout=3.0
                )
                if response.choices and response.choices[0].message.content:
                    reply_text = response.choices[0].message.content.strip()
                    print(f"[CourseIQ Assistant] OpenAI API successfully responded ({len(reply_text)} chars)")
            except Exception as api_err:
                err_msg = str(api_err)
                print(f"[CourseIQ Assistant] OpenAI API error ({type(api_err).__name__}): {err_msg[:120]}")
                # Set brief cooldown on quota exhaustion to avoid lagging user on rapid requests
                if "429" in err_msg or "credits" in err_msg or "Connection error" in err_msg:
                    self.api_cooldown_until = current_time + 60

        # 5. If OpenAI didn't respond (e.g. 429 Quota exhausted, offline, or key error),
        # use the CourseIQ Educational Knowledge Engine
        if not reply_text:
            reply_text = generate_educational_answer(message, history=history, current_page=current_page)

        # 6. Save exchange in conversation history
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


# Global singleton
openai_service = OpenAIService()
