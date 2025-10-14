
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PaperAirplaneIcon, UserCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { streamChat } from '../api/chat';
import { useAuth } from '../contexts/AuthContext';
import { useJournal } from '../contexts/JournalContext';
import { useTest } from '../contexts/TestContext';
import Markdown from 'react-markdown';


interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isGuest } = useAuth();
  const { entries: journalEntries } = useJournal();
  const { getLatestResult } = useTest();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    initializeChat();
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = useCallback(() => {
    if (user) {
        chatRef.current = true;

        setMessages([
            { sender: 'bot', text: `Hello ${user.name}! I'm Serene, your personal AI companion for mental wellness. How are you feeling today?` }
        ]);
    }
  }, [user, isGuest, journalEntries, getLatestResult]);


  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add a placeholder for the bot's response
    setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

    try {
      if (chatRef.current) {
        let botResponseText = '';
        await streamChat(input, (chunk) => {
          botResponseText += chunk;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { sender: 'bot', text: botResponseText };
            return newMessages;
          });
        });
      }
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { sender: 'bot', text: 'Sorry, I encountered an error. Please try again.' };
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
