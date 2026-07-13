package com.akash.aisupportautomation.dto;

public class DashboardSummaryResponse {

    private long totalTickets;
    private long openTickets;
    private long closedTickets;
    private long inProgressTickets;
    private long criticalTickets;
    private long highPriorityTickets;
    private long escalatedTickets;

    public DashboardSummaryResponse() {
    }

    public DashboardSummaryResponse(long totalTickets,
                                    long openTickets,
                                    long closedTickets,
                                    long inProgressTickets,
                                    long criticalTickets,
                                    long highPriorityTickets,
                                    long escalatedTickets) {

        this.totalTickets = totalTickets;
        this.openTickets = openTickets;
        this.closedTickets = closedTickets;
        this.inProgressTickets = inProgressTickets;
        this.criticalTickets = criticalTickets;
        this.highPriorityTickets = highPriorityTickets;
        this.escalatedTickets = escalatedTickets;
    }

    public long getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(long totalTickets) {
        this.totalTickets = totalTickets;
    }

    public long getOpenTickets() {
        return openTickets;
    }

    public void setOpenTickets(long openTickets) {
        this.openTickets = openTickets;
    }

    public long getClosedTickets() {
        return closedTickets;
    }

    public void setClosedTickets(long closedTickets) {
        this.closedTickets = closedTickets;
    }

    public long getInProgressTickets() {
        return inProgressTickets;
    }

    public void setInProgressTickets(long inProgressTickets) {
        this.inProgressTickets = inProgressTickets;
    }

    public long getCriticalTickets() {
        return criticalTickets;
    }

    public void setCriticalTickets(long criticalTickets) {
        this.criticalTickets = criticalTickets;
    }

    public long getHighPriorityTickets() {
        return highPriorityTickets;
    }

    public void setHighPriorityTickets(long highPriorityTickets) {
        this.highPriorityTickets = highPriorityTickets;
    }

    public long getEscalatedTickets() {
        return escalatedTickets;
    }

    public void setEscalatedTickets(long escalatedTickets) {
        this.escalatedTickets = escalatedTickets;
    }
}