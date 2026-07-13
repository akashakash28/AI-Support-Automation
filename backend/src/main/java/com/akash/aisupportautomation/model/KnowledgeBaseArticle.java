package com.akash.aisupportautomation.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class KnowledgeBaseArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String category;

    private Integer sourceTicketId;

    private LocalDateTime createdAt;

    public KnowledgeBaseArticle() {
    }

    public KnowledgeBaseArticle(String title, String content, String category, Integer sourceTicketId) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.sourceTicketId = sourceTicketId;
        this.createdAt = LocalDateTime.now();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getSourceTicketId() {
        return sourceTicketId;
    }

    public void setSourceTicketId(Integer sourceTicketId) {
        this.sourceTicketId = sourceTicketId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
