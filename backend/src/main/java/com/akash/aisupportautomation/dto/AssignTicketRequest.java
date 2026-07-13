package com.akash.aisupportautomation.dto;

import jakarta.validation.constraints.NotBlank;

public class AssignTicketRequest {

    @NotBlank(message = "Assigned Agent is required")
    private String assignedAgent;

    public AssignTicketRequest() {
    }

    public AssignTicketRequest(String assignedAgent) {
        this.assignedAgent = assignedAgent;
    }

    public String getAssignedAgent() {
        return assignedAgent;
    }

    public void setAssignedAgent(String assignedAgent) {
        this.assignedAgent = assignedAgent;
    }
}