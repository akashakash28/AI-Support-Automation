package com.akash.aisupportautomation.dto;

import jakarta.validation.constraints.NotBlank;

public class ResolveTicketRequest {

    @NotBlank(message = "Resolution Remarks are required")
    private String resolutionRemarks;

    public ResolveTicketRequest() {
    }

    public ResolveTicketRequest(String resolutionRemarks) {
        this.resolutionRemarks = resolutionRemarks;
    }

    public String getResolutionRemarks() {
        return resolutionRemarks;
    }

    public void setResolutionRemarks(String resolutionRemarks) {
        this.resolutionRemarks = resolutionRemarks;
    }
}