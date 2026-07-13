import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ReactMarkdown from "react-markdown";

const KnowledgeBase = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const res = await api.get('/knowledge-base');
            setArticles(res.data);
        } catch (error) {
            console.error("Failed to load Knowledge Base articles", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 text-white-override">
            <h2 className="mb-4"><i className="bi bi-book"></i> Knowledge Base</h2>
            <p className="text-muted">Explore AI-generated solutions from previously resolved tickets.</p>

            {loading ? (
                <div>Loading...</div>
            ) : articles.length === 0 ? (
                <div className="alert alert-info">No Knowledge Base articles available yet. Articles are generated automatically when support tickets are resolved.</div>
            ) : (
                <div className="row">
                    {articles.map((article) => (
                        <div key={article.id} className="col-md-6 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-header bg-light">
                                    <h5 className="mb-0 text-dark">{article.title}</h5>
                                    <small className="text-muted">Category: {article.category || 'General'}</small>
                                </div>
                                <div className="card-body text-dark">
                                    <div><ReactMarkdown>{article.content}</ReactMarkdown></div>
                                </div>
                                <div className="card-footer bg-white text-muted small">
                                    Generated from Ticket #{article.sourceTicketId} on {new Date(article.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KnowledgeBase;
