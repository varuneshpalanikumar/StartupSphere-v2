import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';
import './StartupAdvisorChat.css';

const StartupAdvisorChat = ({ startupId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestions = [
    'Market Analysis',
    'Revenue Strategy',
    'Competitor Analysis',
    'MVP Roadmap',
    'Funding Readiness'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (question) => {
    if (!question.trim()) return;

    const userMessage = { role: 'user', text: question };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await API.post(`/ai/chat/${startupId}`, { question });
      if (res.data && res.data.data && res.data.data.answer) {
        const aiMessage = { role: 'ai', text: res.data.data.answer };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err) {
      let errorText = 'Sorry, I encountered an error while processing your request. Please try again later.';
      
      if (err.response?.status === 429) {
        errorText = 'Quota exceeded. Please try again later.';
      } else if (err.response?.status === 503) {
        errorText = 'AI service is currently busy.\nPlease try again in a few seconds.';
      } else if (err.response?.status >= 500) {
        errorText = 'Server error occurred. Please try again.';
      } else if (!err.response) {
        errorText = 'Network error. Please check your connection.';
      } else if (err.response?.data?.message) {
        errorText = err.response.data.message;
      }

      const errorMessage = { role: 'ai', text: errorText };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="advisor-chat-container">
      <div className="chat-header">
        <h3>AI Advisor Chat</h3>
        <p>Get instant advice tailored to your startup's profile and assessment.</p>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && !loading && (
          <div className="empty-state" style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
            <h4>No messages yet</h4>
            <p>Start a conversation with your AI Advisor by asking a question or choosing a suggestion below.</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`message message-${msg.role}`}>
            <div className="message-text">
              {msg.text.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="loading-indicator">AI is thinking...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-suggestions">
        {suggestions.map((suggestion, idx) => (
          <button 
            key={idx} 
            className="suggestion-btn"
            onClick={() => handleSend(`Can you provide a ${suggestion} for my startup?`)}
            disabled={loading}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form className="chat-input-area" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Ask your AI Advisor..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn-send" disabled={!input.trim() || loading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default StartupAdvisorChat;
