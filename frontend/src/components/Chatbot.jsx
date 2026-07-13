import { useState } from "react";
import api from "../api/axios";

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I am your AI Assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages([...messages, { text: userMsg, isBot: false }]);
        setInput("");
        setLoading(true);

        try {
            const res = await api.post("/ai/chat", { question: userMsg });
            setMessages(prev => [...prev, { text: res.data.answer, isBot: true }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Sorry, I am having trouble connecting to my brain right now.", isBot: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
            {/* Chat Window */}
            {isOpen && (
                <div className="card shadow-lg mb-3" style={{ width: '350px', height: '450px', display: 'flex', flexDirection: 'column', border: 'none', borderRadius: '16px', overflow: 'hidden' }}>
                    <div className="bg-primary text-white p-3 d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                        <h5 className="mb-0" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white' }}>🤖 AI Support Guide</h5>
                        <button onClick={toggleChat} className="btn-close btn-close-white" aria-label="Close"></button>
                    </div>
                    
                    <div className="card-body" style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f8f9fa', padding: '15px' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`d-flex mb-3 ${msg.isBot ? 'justify-content-start' : 'justify-content-end'}`}>
                                <div style={{
                                    maxWidth: '80%',
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    backgroundColor: msg.isBot ? '#e9ecef' : '#4f46e5',
                                    color: msg.isBot ? '#212529' : 'white',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.4'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="d-flex justify-content-start mb-3">
                                <div style={{ backgroundColor: '#e9ecef', padding: '8px 12px', borderRadius: '12px' }}>
                                    <span className="spinner-grow spinner-grow-sm text-primary me-1" role="status" aria-hidden="true"></span>
                                    <span className="spinner-grow spinner-grow-sm text-primary me-1" role="status" aria-hidden="true"></span>
                                    <span className="spinner-grow spinner-grow-sm text-primary" role="status" aria-hidden="true"></span>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="p-3 bg-white" style={{ borderTop: '1px solid #dee2e6' }}>
                        <form onSubmit={handleSend} className="d-flex gap-2">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Ask a question..." 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                style={{ borderRadius: '20px' }}
                                disabled={loading}
                            />
                            <button type="submit" className="btn btn-primary" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }} disabled={loading}>
                                ↗
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            {!isOpen && (
                <button 
                    onClick={toggleChat}
                    className="btn btn-primary shadow-lg"
                    style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '24px',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    💬
                </button>
            )}
        </div>
    );
}

export default Chatbot;
