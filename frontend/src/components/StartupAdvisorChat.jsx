import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';
import './StartupAdvisorChat.css';

const StartupAdvisorChat = ({ startupId }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI Startup Advisor. Ask me anything about your market, revenue strategy, competitors, or how to improve your startup.' }
  ]);
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
      const errorMessage = { role: 'ai', text: 'Sorry, I encountered an error while processing your request. Please try again later.' };
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
