
import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, UserCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import type { ChatMessage, ChatSession } from '../types';
import Markdown from 'react-markdown';

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isGuest } = useAuth();

  useEffect(() => {
    initializeChat();
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = () => {
    if (user) {
      const welcomeMessage: ChatMessage = {
        id: 0,
        message: `Hello ${user.username}! I'm your AI mental health companion. I'm here to listen, support, and help you on your wellness journey. How are you feeling today?`,
        is_user: false,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    }
  };

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      message: input,
      is_user: true,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    const messageText = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiService.sendMessage({
        message: messageText,
        session_id: currentSessionId || undefined,
      });

      // If this is the first message, extract session ID from response
      if (!currentSessionId && response.id) {
        // We'll need to get the session ID from the backend response
        // For now, we'll generate one locally
        setCurrentSessionId(`session_${Date.now()}`);
      }

      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        message: 'Sorry, I encountered an error. Please try again. If you\'re not logged in, some features may be limited.',
        is_user: false,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral rounded-lg shadow-md">
      <header className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-neutral dark:text-white">AI Wellness Chat</h1>
      </header>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={msg.id || index} className={`flex items-start gap-3 ${msg.is_user ? 'justify-end' : ''}`}>
            {!msg.is_user && <SparklesIcon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />}
            <div className={`max-w-xl p-3 rounded-2xl ${
                msg.is_user
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-gray-100 dark:bg-dark text-neutral dark:text-light rounded-bl-none'
              }`}
            >
              <Markdown>{msg.message}</Markdown>
            </div>
            {msg.is_user && <UserCircleIcon className="h-8 w-8 text-secondary flex-shrink-0 mt-1" />}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <SparklesIcon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div className="max-w-xl p-3 rounded-2xl bg-gray-100 dark:bg-dark text-neutral dark:text-light rounded-bl-none">
              <div className="animate-pulse flex space-x-2">
                <div className="rounded-full bg-gray-300 h-2 w-2"></div>
                <div className="rounded-full bg-gray-300 h-2 w-2"></div>
                <div className="rounded-full bg-gray-300 h-2 w-2"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="w-full pl-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-light dark:bg-dark text-neutral dark:text-light focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-white rounded-full hover:bg-primary/90 disabled:bg-gray-400 transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
