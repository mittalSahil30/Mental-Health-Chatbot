import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Send, Bot, User, Loader, Heart, Shield } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          message: `Hello ${user?.username || 'there'}! I'm your mental health companion. I'm here to listen, support, and help you through whatever you're going through. How are you feeling today?`,
          is_user: false,
          created_at: new Date().toISOString()
        }
      ]);
    }
  }, [user]);

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      message: inputMessage,
      is_user: true,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/chat', {
        message: inputMessage,
        user_id: user?.id
      });

      const botMessage = {
        id: Date.now() + 1,
        message: response.data.message,
        is_user: false,
        created_at: response.data.created_at
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorMessage = "I'm sorry, I'm having trouble responding right now. Please try again in a moment.";
      
      if (error.response?.status === 500) {
        errorMessage = "The server is experiencing issues. Please try again later.";
      } else if (error.response?.status === 404) {
        errorMessage = "User not found. Please refresh the page and try again.";
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast.error('Failed to send message. Please try again.');
      
      const errorResponse = {
        id: Date.now() + 1,
        message: errorMessage,
        is_user: false,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chatbot-page fade-in">
      <div className="text-center mb-12">
        <div className="floating">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            <span className="gradient-text">Mental Health Chatbot</span>
          </h1>
        </div>
        <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
          Your AI companion for mental health support and guidance. I'm here to listen, support, and help you through whatever you're experiencing.
        </p>
      </div>

      <div className="chatbot-container">
        <div className="chatbot-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.is_user ? 'user' : 'bot'}`}
            >
              <div className="message-avatar">
                {message.is_user ? (
                  <User size={16} />
                ) : (
                  <Bot size={16} />
                )}
              </div>
              <div className="message-content">
                <p>{message.message}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {formatTime(message.created_at)}
                </span>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="message bot">
              <div className="message-avatar">
                <Bot size={16} />
              </div>
              <div className="message-content">
                <div className="flex items-center">
                  <Loader className="animate-spin mr-2" size={16} />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="chatbot-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="px-6 py-3"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

    </div>
  );
};

export default Chatbot;