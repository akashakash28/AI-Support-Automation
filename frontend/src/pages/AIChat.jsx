import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ReactMarkdown from "react-markdown";

const AIChat = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your AI IT Assistant. Describe your issue, and I will try to help you solve it!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        const currentMessages = [...messages];
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const history = currentMessages.map(m => (m.role === 'user' ? 'User: ' : 'Assistant: ') + m.content);
            const response = await api.post('/ai/chat', { question: userMsg, history: history });
            
            setMessages(prev => [...prev, { role: 'assistant', content: response.data.answer }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting to my servers right now.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setMessages([{ role: 'assistant', content: 'Hello! I am your AI IT Assistant. Describe your issue, and I will try to help you solve it!' }]);
    };

    const handleEscalate = async () => {
        if (messages.length <= 1) {
            alert("Please describe your issue first before escalating.");
            return;
        }

        const userIssue = messages.find(m => m.role === 'user')?.content || "Support Request";
        const conversationLog = messages.map(m => `**${m.role === 'user' ? 'User' : 'AI'}**: ${m.content}`).join('\n\n');

        const title = userIssue.length > 50 ? userIssue.substring(0, 50) + "..." : userIssue;
        const description = `*This ticket was automatically escalated from the AI Chat Assistant.*\n\n### Chat Transcript\n\n${conversationLog}`;

        try {
            const response = await api.post('/tickets', {
                title: title,
                description: description,
                category: 'General',
                priority: 'Medium'
            });
            alert("Ticket successfully created! Our human team will look into this immediately.");
            navigate(`/tickets/${response.data.id}`);
        } catch (error) {
            alert("Failed to create ticket.");
        }
    };

    return (
        <div className="w-100 text-dark">
            <h2 className="mb-2">Ask AI Assistant</h2>
            <p className="text-muted mb-3">Try resolving your issue instantly before creating a support ticket.</p>
            
            <div className="card shadow-sm border-0" style={{ height: '75vh', display: 'flex', flexDirection: 'column', background: "rgba(0,0,0,0.6)", backdropFilter: "blur(15px)" }}>
                <div className="card-header border-bottom border-secondary p-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 text-white"><i className="bi bi-robot text-primary me-2"></i> IT Support Bot</h5>
                    <div>
                        <button onClick={handleClear} className="btn btn-sm btn-outline-light fw-bold me-2 rounded-pill px-3">
                            Clear Chat
                        </button>
                        <button onClick={handleEscalate} className="btn btn-sm btn-danger fw-bold rounded-pill px-3 shadow-sm">
                            Escalate to Human
                        </button>
                    </div>
                </div>
                
                <div className="card-body overflow-auto flex-grow-1" style={{ padding: '20px' }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div className={`p-3 rounded-4 shadow-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'text-light border border-secondary'}`} style={{ maxWidth: '75%', background: msg.role === 'user' ? '' : 'rgba(255,255,255,0.05)', backdropFilter: "blur(5px)" }}>
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="d-flex mb-3 justify-content-start">
                            <div className="p-3 rounded-4 shadow-sm text-light border border-secondary" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: "blur(5px)" }}>
                                <em><span className="spinner-grow spinner-grow-sm me-2 text-primary"></span>AI is typing...</em>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="card-footer border-top border-secondary p-3" style={{ background: "transparent" }}>
                    <form onSubmit={handleSend} className="d-flex gap-2">
                        <input 
                            type="text" 
                            className="form-control form-control-lg bg-dark text-white border-secondary rounded-pill px-4" 
                            placeholder="Type your issue here..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                            style={{ color: "white" }}
                        />
                        <button type="submit" className="btn btn-primary btn-lg rounded-pill px-4 shadow-sm" disabled={loading || !input.trim()}>
                            <i className="bi bi-send"></i> Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AIChat;
