package com.akash.aisupportautomation.dto;

public class AIResponse {

    private String category;
    private String priority;
    private String assignedTeam;
    private String suggestion;
    private String ticketType;
    private Boolean aiApproved;

    public AIResponse() {
    }

    public String getTicketType() {
        return ticketType;
    }

    public void setTicketType(String ticketType) {
        this.ticketType = ticketType;
    }

    public Boolean getAiApproved() {
        return aiApproved;
    }

    public void setAiApproved(Boolean aiApproved) {
        this.aiApproved = aiApproved;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getAssignedTeam() {
        return assignedTeam;
    }

    public void setAssignedTeam(String assignedTeam) {
        this.assignedTeam = assignedTeam;
    }

    public String getSuggestion() {
        return suggestion;
    }

    public void setSuggestion(String suggestion) {
        this.suggestion = suggestion;
    }
}