package com.akash.aisupportautomation.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String description;

    // AI will set this automatically
    private String priority;

    @Enumerated(EnumType.STRING)
    @jakarta.persistence.Column(columnDefinition = "VARCHAR(50)")
    private TicketStatus status;

    private String employeeName;

    private String employeeEmail;

    // ==========================
    // Ticket Ownership
    // ==========================

    private String createdBy;

    private String assignedAgent;

    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String resolutionRemarks;

    // ==========================
    // AI Fields
    // ==========================

    private String category;

    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String aiSuggestion;

    private String assignedTeam;

    // ==========================
    // Phase 3: Enterprise Features
    // ==========================

    private java.time.LocalDateTime slaDeadline;

    private boolean isEscalated = false;

    private Integer parentTicketId;

    private java.time.LocalDateTime createdAt;

    // ==========================
    // Phase 4: Resource Approvals
    // ==========================
    
    // ISSUE or RESOURCE_REQUEST
    private String ticketType;

    private Boolean aiApproved;

    @jakarta.persistence.PrePersist
    protected void onCreate() {
        this.createdAt = java.time.LocalDateTime.now();
    }

    // ==========================
    // Constructors
    // ==========================

    public Ticket() {
        this.status = TicketStatus.OPEN;
    }

    public Ticket(
            Integer id,
            String title,
            String description,
            String priority,
            TicketStatus status,
            String employeeName,
            String employeeEmail,
            String createdBy,
            String assignedAgent,
            String resolutionRemarks,
            String category,
            String aiSuggestion,
            String assignedTeam) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.employeeName = employeeName;
        this.employeeEmail = employeeEmail;
        this.createdBy = createdBy;
        this.assignedAgent = assignedAgent;
        this.resolutionRemarks = resolutionRemarks;
        this.category = category;
        this.aiSuggestion = aiSuggestion;
        this.assignedTeam = assignedTeam;
    }

    // ==========================
    // Getters & Setters
    // ==========================

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getEmployeeEmail() {
        return employeeEmail;
    }

    public void setEmployeeEmail(String employeeEmail) {
        this.employeeEmail = employeeEmail;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getAssignedAgent() {
        return assignedAgent;
    }

    public void setAssignedAgent(String assignedAgent) {
        this.assignedAgent = assignedAgent;
    }

    public String getResolutionRemarks() {
        return resolutionRemarks;
    }

    public void setResolutionRemarks(String resolutionRemarks) {
        this.resolutionRemarks = resolutionRemarks;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getAiSuggestion() {
        return aiSuggestion;
    }

    public void setAiSuggestion(String aiSuggestion) {
        this.aiSuggestion = aiSuggestion;
    }

    public String getAssignedTeam() {
        return assignedTeam;
    }

    public void setAssignedTeam(String assignedTeam) {
        this.assignedTeam = assignedTeam;
    }

    public java.time.LocalDateTime getSlaDeadline() {
        return slaDeadline;
    }

    public void setSlaDeadline(java.time.LocalDateTime slaDeadline) {
        this.slaDeadline = slaDeadline;
    }

    public boolean isEscalated() {
        return isEscalated;
    }

    public void setEscalated(boolean escalated) {
        isEscalated = escalated;
    }

    public Integer getParentTicketId() {
        return parentTicketId;
    }

    public void setParentTicketId(Integer parentTicketId) {
        this.parentTicketId = parentTicketId;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
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

    @Override
    public String toString() {
        return "Ticket{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", priority='" + priority + '\'' +
                ", status=" + status +
                ", employeeName='" + employeeName + '\'' +
                ", employeeEmail='" + employeeEmail + '\'' +
                ", createdBy='" + createdBy + '\'' +
                ", assignedAgent='" + assignedAgent + '\'' +
                ", resolutionRemarks='" + resolutionRemarks + '\'' +
                ", category='" + category + '\'' +
                ", aiSuggestion='" + aiSuggestion + '\'' +
                ", assignedTeam='" + assignedTeam + '\'' +
                '}';
    }
}