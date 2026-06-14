import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';

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
    <div className="card">
      <div style={{ marginBottom: '20px' }}>
        <h3 className="section-title" style={{ marginBottom: '8px' }}>AI Advisor Chat</h3>
        <p className="muted" style={{ margin: 0 }}>Get instant advice tailored to your startup's profile and assessment.</p>
      </div>

      <div style={{ height: '400px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '20px', background: 'var(--surface)' }}>
        {messages.length === 0 && !loading && (
          <div className="muted" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--text-soft)' }}>No messages yet</h4>
            <p>Start a conversation with your AI Advisor by asking a question or choosing a suggestion below.</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '12px' }}>
            <div style={{ maxWidth: '80%', padding: '12px 16px', borderRadius: '16px', background: msg.role === 'user' ? 'linear-gradient(135deg, var(--primary-2), var(--primary))' : 'var(--surface-2)', color: msg.role === 'user' ? 'white' : 'var(--text)', boxShadow: 'var(--shadow-sm)' }}>
              {msg.text.split('\n').map((line, i) => (
                <p key={i} style={{ margin: 0, minHeight: '1em', lineHeight: '1.5' }}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="muted" style={{ fontStyle: 'italic', marginLeft: '12px' }}>AI is thinking...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {suggestions.map((suggestion, idx) => (
          <button 
            key={idx} 
            className="btn btn-secondary"
            style={{ fontSize: '0.9rem', padding: '6px 12px', borderRadius: '20px' }}
            onClick={() => handleSend(`Can you provide a ${suggestion} for my startup?`)}
            disabled={loading}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Ask your AI Advisor..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          style={{ flex: 1, padding: '14px 15px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', background: 'var(--surface)', color: 'var(--text)' }}
        />
        <button type="submit" className="btn btn-primary" disabled={!input.trim() || loading} style={{ padding: '0 24px' }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default StartupAdvisorChat;