import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiSend, FiUser, FiBot, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px 16px 0 0;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 0.9rem;
`;

const MessagesContainer = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  ${props => props.isUser && 'flex-direction: row-reverse;'}
`;

const MessageAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
  
  ${props => props.isUser 
    ? 'background: #667eea; color: white;' 
    : 'background: #f0f0f0; color: #666;'
  }
`;

const MessageContent = styled.div`
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  font-size: 0.95rem;
  line-height: 1.5;
  
  ${props => props.isUser 
    ? 'background: #667eea; color: white; border-bottom-right-radius: 4px;' 
    : 'background: #f8f9fa; color: #333; border-bottom-left-radius: 4px;'
  }
`;

const InputContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 0 0 16px 16px;
  padding: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const InputForm = styled.form`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 20px;
  font-size: 1rem;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SendButton = styled.button`
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: #667eea;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #5a6fd8;
    transform: scale(1.05);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-style: italic;
  padding: 0.75rem 1rem;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const WelcomeTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const WelcomeText = styled.p`
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const QuickActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #667eea;
    color: white;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 1rem;
  text-align: center;
`;

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setLoading(true);
    setError('');

    try {
      const endpoint = user ? '/chat' : '/chat/guest';
      const response = await axios.post(endpoint, { message });
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleQuickAction = (message) => {
    sendMessage(message);
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
  };

  const quickActions = [
    "I'm feeling anxious today",
    "Help me with stress management",
    "I need someone to talk to",
    "What are some coping strategies?",
    "I'm having trouble sleeping"
  ];

  return (
    <ChatContainer>
      <ChatHeader>
        <Title>Mental Health Chatbot</Title>
        <Subtitle>
          {user ? `Welcome back, ${user.full_name || 'User'}!` : 'Welcome! I\'m here to support you.'}
        </Subtitle>
      </ChatHeader>

      <MessagesContainer>
        {messages.length === 0 ? (
          <WelcomeMessage>
            <WelcomeTitle>How can I help you today?</WelcomeTitle>
            <WelcomeText>
              I'm here to provide emotional support and mental health guidance. 
              Feel free to share what's on your mind, and I'll do my best to help.
            </WelcomeText>
            <QuickActions>
              {quickActions.map((action, index) => (
                <QuickActionButton
                  key={index}
                  onClick={() => handleQuickAction(action)}
                >
                  {action}
                </QuickActionButton>
              ))}
            </QuickActions>
          </WelcomeMessage>
        ) : (
          <>
            {messages.map((message) => (
              <Message key={message.id} isUser={message.isUser}>
                <MessageAvatar isUser={message.isUser}>
                  {message.isUser ? <FiUser /> : <FiBot />}
                </MessageAvatar>
                <MessageContent isUser={message.isUser}>
                  {message.text}
                </MessageContent>
              </Message>
            ))}
            
            {loading && (
              <Message>
                <MessageAvatar>
                  <FiBot />
                </MessageAvatar>
                <LoadingMessage>
                  <FiRefreshCw className="animate-spin" />
                  Thinking...
                </LoadingMessage>
              </Message>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </MessagesContainer>

      <InputContainer>
        <InputForm onSubmit={handleSubmit}>
          <MessageInput
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <SendButton type="submit" disabled={loading || !inputMessage.trim()}>
            <FiSend />
          </SendButton>
        </InputForm>
        
        {messages.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              onClick={clearChat}
              style={{
                background: 'none',
                border: '1px solid #ddd',
                color: '#666',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Clear Chat
            </button>
          </div>
        )}
      </InputContainer>
    </ChatContainer>
  );
};

export default Chatbot;