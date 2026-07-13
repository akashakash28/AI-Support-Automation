package com.akash.aisupportautomation.dto;

public class TeamCountResponse {

    private String assignedTeam;
    private long count;

    public TeamCountResponse() {
    }

    public TeamCountResponse(String assignedTeam, long count) {
        this.assignedTeam = assignedTeam;
        this.count = count;
    }

    public String getAssignedTeam() {
        return assignedTeam;
    }

    public void setAssignedTeam(String assignedTeam) {
        this.assignedTeam = assignedTeam;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

}