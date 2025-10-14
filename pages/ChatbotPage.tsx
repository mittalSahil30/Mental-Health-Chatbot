
import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, UserCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { chatAPI } from '../services/api';
import Markdown from 'react-markdown';


interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Load chat history when component mounts
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const response = await chatAPI.getHistory(1, 50);
      const historicalMessages: Message[] = [];
      
      // Convert chat history to messages format (reverse to show oldest first)
      response.chats.reverse().forEach(chat => {
        historicalMessages.push({ sender: 'user', text: chat.message });
        historicalMessages.push({ sender: 'bot', text: chat.response });
      });

      if (historicalMessages.length === 0) {
        // Welcome message if no history
        setMessages([
          { sender: 'bot', text: `Hello ${user?.name || 'there'}! I'm Serene, your personal AI companion for mental wellness. How are you feeling today?` }
        ]);
      } else {
        setMessages(historicalMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Show welcome message on error
      setMessages([
        { sender: 'bot', text: `Hello ${user?.name || 'there'}! I'm Serene, your personal AI companion for mental wellness. How are you feeling today?` }
      ]);
    }
  };

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    const currentInput = input;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add a placeholder for the bot's response
    setMessages(prev => [...prev, { sender: 'bot', text: '...' }]);

    try {
      const response = await chatAPI.sendMessage(currentInput);
      
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { sender: 'bot', text: response.response };
        return newMessages;
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          sender: 'bot', 
          text: 'Sorry, I encountered an error. Please try again. Make sure the backend server is running and the Gemini API key is configured.' 
        };
        return newMessages;
      });
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
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'bot' && <SparklesIcon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />}
            <div className={`max-w-xl p-3 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-gray-100 dark:bg-dark text-neutral dark:text-light rounded-bl-none'
              }`}
            >
              {msg.text ? <Markdown>{msg.text}</Markdown> : <div className="animate-pulse flex space-x-2"><div className="rounded-full bg-gray-300 h-2 w-2"></div><div className="rounded-full bg-gray-300 h-2 w-2"></div><div className="rounded-full bg-gray-300 h-2 w-2"></div></div>}
            </div>
             {msg.sender === 'user' && <UserCircleIcon className="h-8 w-8 text-secondary flex-shrink-0 mt-1" />}
          </div>
        ))}
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
