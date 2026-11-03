import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAudio } from '../audio/AudioContext';

const ChatbotContext = createContext(null);

const STORAGE_KEY_MESSAGES = 'courseiq_chat_messages';
const STORAGE_KEY_CONV_ID = 'courseiq_chat_conv_id';
const STORAGE_KEY_OPEN = 'courseiq_chat_is_open';

export function ChatbotProvider({ children, currentPage = 'home' }) {
  const { playClick, playProcessingStart, playSuccess, playError } = useAudio();

  const [isOpen, setIsOpen] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_OPEN) === 'true';
    } catch {
      return false;
    }
  });

  const [isMinimized, setIsMinimized] = useState(false);

  const [conversationId, setConversationId] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_CONV_ID) || null;
    } catch {
      return null;
    }
  });

  const [messages, setMessages] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY_MESSAGES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [inputDraft, setInputDraft] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Sync state to sessionStorage for seamless page navigation
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_OPEN, String(isOpen));
    } catch {}
  }, [isOpen]);

  useEffect(() => {
    if (conversationId) {
      try {
        sessionStorage.setItem(STORAGE_KEY_CONV_ID, conversationId);
      } catch {}
    }
  }, [conversationId]);

  const openChat = useCallback(() => {
    playClick();
    setIsOpen(true);
    setIsMinimized(false);
  }, [playClick]);

  const closeChat = useCallback(() => {
    playClick();
    setIsOpen(false);
  }, [playClick]);

  const toggleChat = useCallback(() => {
    playClick();
    setIsOpen(prev => !prev);
    if (isMinimized) setIsMinimized(false);
  }, [playClick, isMinimized]);

  const minimizeChat = useCallback(() => {
    playClick();
    setIsMinimized(true);
  }, [playClick]);

  const restoreChat = useCallback(() => {
    playClick();
    setIsMinimized(false);
    setIsOpen(true);
  }, [playClick]);

  // Send a new message
  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    playProcessingStart();

    const userMsgId = `msg_user_${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    // Optimistically update conversation
    setMessages(prev => [...prev, userMsg]);
    setInputDraft('');
    setLoading(true);

    try {
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          conversationId: conversationId,
          currentPage: currentPage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.reply) {
        playSuccess();
        if (data.conversationId) {
          setConversationId(data.conversationId);
        }

        const aiMsg = {
          id: `msg_ai_${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent'
        };

        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error(data.error || 'Unable to receive response.');
      }
    } catch (err) {
      playError();
      console.warn('[CourseIQ Assistant] Chat message error:', err);

      // Preserve typed draft if network failed completely so user doesn't lose text
      setInputDraft(trimmed);

      const errorMsg = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: "I'm having a brief connection issue communicating with the AI service. Please verify your connection or click retry below.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'error',
        failedUserText: trimmed
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [loading, conversationId, currentPage, playProcessingStart, playSuccess, playError]);

  // Retry a failed message
  const retryMessage = useCallback((failedText) => {
    if (!failedText) return;
    sendMessage(failedText);
  }, [sendMessage]);

  // Clear current conversation
  const clearConversation = useCallback(async () => {
    playClick();
    if (conversationId) {
      try {
        await fetch('/api/chatbot/clear', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId })
        });
      } catch (e) {
        console.warn('Could not notify backend of cleared chat:', e);
      }
    }
    setMessages([]);
    setConversationId(null);
    setInputDraft('');
    setShowClearConfirm(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY_MESSAGES);
      sessionStorage.removeItem(STORAGE_KEY_CONV_ID);
    } catch {}
  }, [conversationId, playClick]);

  // Start a fresh chat
  const newChat = useCallback(() => {
    clearConversation();
  }, [clearConversation]);

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        isMinimized,
        messages,
        loading,
        inputDraft,
        setInputDraft,
        showClearConfirm,
        setShowClearConfirm,
        openChat,
        closeChat,
        toggleChat,
        minimizeChat,
        restoreChat,
        sendMessage,
        retryMessage,
        clearConversation,
        newChat,
        currentPage
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}

