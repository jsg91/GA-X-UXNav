import { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { ANIMATION_DELAYS } from '@/constants/animation-delays';
import { OPACITY, REFOCUS_DELAYS } from '@/constants/opacity';
import { refocusInput as refocusInputUtil } from '@/hooks/use-auto-focus';
import { useAutoFocus } from '@/hooks/use-auto-focus';

/**
 * Message type for AI chat
 */
export interface AIMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

/**
 * AI Chat hook state and functionality
 * Manages AI modal, messages, input handling, and auto-focus behavior
 */
export interface AIChatState {
  // Modal state
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;

  // Input state
  inputValue: string;
  setInputValue: (value: string) => void;

  // Messages state
  messages: AIMessage[];

  // Sending state
  isSending: boolean;

  // Refs
  scrollViewRef: React.RefObject<ScrollView>;
  inputRef: React.RefObject<any>;

  // Actions
  sendMessage: (message?: string) => void;
  toggleModal: () => void;

  // Computed values
  canSendMessage: boolean;
}

export function useAIChat(): AIChatState {
  // Modal state
  const [isOpen, setIsOpen] = useState(false);

  // Input state
  const [inputValue, setInputValue] = useState('');

  // Messages state
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      text: "Hello! I'm the GA-X AI Assistant. I can help you with:",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);

  // Sending state
  const [isSending, setIsSending] = useState(false);

  // Refs
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<any>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, ANIMATION_DELAYS.standard);
    }
  }, [messages]);

  // Auto-focus input when AI modal opens
  useAutoFocus(inputRef, isOpen, {
    selector: 'input[placeholder*="Type your message"]',
    clickOnFocus: true,
  });

  // Send message function
  const sendMessage = (message?: string) => {
    const messageToSend = message || inputValue.trim();
    if (!messageToSend) return;

    setIsSending(true);

    // Add user message
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      text: messageToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Keep keyboard open by aggressively refocusing input after sending
    // Use shared utility function for consistent refocus behavior
    refocusInputUtil(inputRef, 'input[placeholder*="Type your message"]', [...REFOCUS_DELAYS]);

    // Set sending state to false after delay
    setTimeout(() => {
      setIsSending(false);
    }, ANIMATION_DELAYS.medium);

    // Simulate AI response (you can replace this with actual API call)
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: `ai-${Date.now()}`,
        text: "Thank you for your message! I'm currently in development and will be able to assist you with aviation operations soon. How can I help you today?",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      // Refocus again after AI response
      refocusInputUtil(inputRef, 'input[placeholder*="Type your message"]');
    }, ANIMATION_DELAYS.async);
  };

  // Toggle modal function
  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  // Computed values
  const canSendMessage = inputValue.trim().length > 0 && !isSending;

  return {
    // Modal state
    isOpen,
    setIsOpen,

    // Input state
    inputValue,
    setInputValue,

    // Messages state
    messages,

    // Sending state
    isSending,

    // Refs
    scrollViewRef,
    inputRef,

    // Actions
    sendMessage,
    toggleModal,

    // Computed values
    canSendMessage,
  };
}
