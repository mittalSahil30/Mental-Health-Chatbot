import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Send, Bot, User } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      message: inputMessage.trim(),
      is_user: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/chat', {
        message: inputMessage.trim(),
        user_id: user?.is_guest ? null : user?.id
      });

      const botMessage = {
        id: Date.now() + 1,
        message: response.data.response,
        is_user: false,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response. Please try again.');
      
      const errorMessage = {
        id: Date.now() + 1,
        message: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        is_user: false,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content fade-in">
      <div className="page-header">
        <h1 className="page-title">AI Mental Health Assistant</h1>
        <p className="page-subtitle">
          Your 24/7 companion for mental health support. Ask questions, share concerns, or just talk.
        </p>
      </div>

      <div className="chatbot-container">
        <div className="chatbot-messages">
          {messages.length === 0 && (
            <div className="text-center text-muted py-12">
              <Bot className="mx-auto mb-4" size={48} />
              <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
              <p>I'm here to listen and help. What's on your mind today?</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.is_user ? 'user' : 'bot'}`}
            >
              <div className="message-avatar">
                {message.is_user ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="message-content">
                {message.message}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="message bot">
              <div className="message-avatar">
                <Bot size={16} />
              </div>
              <div className="message-content">
                <div className="flex items-center gap-2">
                  <div className="spinner"></div>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="chatbot-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            disabled={loading}
            className="flex-1"
          />
          <button type="submit" disabled={loading || !inputMessage.trim()}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;