package com.akash.aisupportautomation.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class ChatRequest {

    @NotBlank(message = "Question is required")
    private String question;
    
    private List<String> history;

    public ChatRequest() {
    }

    public ChatRequest(String question, List<String> history) {
        this.question = question;
        this.history = history;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<String> getHistory() {
        return history;
    }

    public void setHistory(List<String> history) {
        this.history = history;
    }
}