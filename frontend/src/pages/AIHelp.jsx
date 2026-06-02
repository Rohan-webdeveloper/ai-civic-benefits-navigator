import { useState, useRef, useEffect } from 'react';
import { askAssistant } from '../api/aiApi';

const AIHelp = () => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content:
        "Hello! 👋 I'm your AI Civic Benefits Assistant. I can help you with:\n\n• Finding eligible government benefits\n• Explaining schemes in simple English\n• Guiding you through the application process\n• Answering questions about documents needed\n\nWhat would you like to know?",
      source: 'local',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await askAssistant(userMessage);
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: res.data.response,
          source: res.data.source,
          note: res.data.note,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content:
            "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment or contact support for assistance.",
          source: 'error',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'What benefits am I eligible for?',
    'Explain the Health Insurance Scheme',
    'What documents do I need?',
    'How to track my application?',
    'Help me with scholarship options',
  ];

  const handleQuickQuestion = (q) => {
    setInput(q);
  };

  return (
    <div className="ai-help-page">
      <div className="page-container">
        <div className="ai-layout">
          {/* Sidebar */}
          <div className="ai-sidebar">
            <div className="ai-sidebar-header">
              <span className="ai-logo">🤖</span>
              <h3>AI Assistant</h3>
            </div>
            <div className="ai-sidebar-info">
              <p>Powered by AI to help you navigate government benefits with ease.</p>
            </div>
            <div className="quick-questions">
              <h4>Quick Questions</h4>
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  className="quick-q-btn"
                  onClick={() => handleQuickQuestion(q)}
                >
                  <span className="qq-icon">💡</span>
                  {q}
                </button>
              ))}
            </div>
            <div className="ai-sidebar-footer">
              <div className="ai-tip">
                <span>💡</span>
                <p>Tip: Ask specific questions for better answers!</p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="ai-chat-area">
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-avatar">🤖</div>
                <div>
                  <h3>AI Benefits Assistant</h3>
                  <span className="chat-status">
                    <span className="status-indicator online"></span>
                    Online — Ready to help
                  </span>
                </div>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.role}`}>
                  {msg.role === 'bot' && (
                    <div className="message-avatar">🤖</div>
                  )}
                  <div className="message-content">
                    <div className="message-bubble">
                      {msg.content.split('\n').map((line, i) => (
                        <p key={i}>{line || '\u00A0'}</p>
                      ))}
                    </div>
                    {msg.source && msg.role === 'bot' && (
                      <span className={`source-badge ${msg.source}`}>
                        {msg.source === 'ai' ? '✨ AI Response' : msg.source === 'local' ? '📋 Quick Response' : '⚠️ Error'}
                      </span>
                    )}
                    {msg.note && (
                      <span className="source-note">{msg.note}</span>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="message-avatar user-msg-avatar">👤</div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="chat-message bot">
                  <div className="message-avatar">🤖</div>
                  <div className="message-content">
                    <div className="message-bubble typing">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Ask about any government benefit or scheme..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button type="submit" className="send-btn" disabled={!input.trim() || loading}>
                ➤
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHelp;
