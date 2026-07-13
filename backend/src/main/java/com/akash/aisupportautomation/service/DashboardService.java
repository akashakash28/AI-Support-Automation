package com.akash.aisupportautomation.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.akash.aisupportautomation.dto.CategoryCountResponse;
import com.akash.aisupportautomation.dto.DashboardSummaryResponse;
import com.akash.aisupportautomation.dto.PriorityCountResponse;
import com.akash.aisupportautomation.dto.TeamCountResponse;
import com.akash.aisupportautomation.model.Ticket;
import com.akash.aisupportautomation.model.TicketStatus;
import com.akash.aisupportautomation.repository.TicketRepository;

@Service
public class DashboardService {

    @Autowired
    private TicketRepository ticketRepository;

    // =====================================
    // Dashboard Summary
    // =====================================

    public DashboardSummaryResponse getSummary() {

        List<Ticket> tickets = ticketRepository.findAll();

        long totalTickets = tickets.size();

        long openTickets = tickets.stream()
                .filter(t -> t.getStatus() == TicketStatus.OPEN)
                .count();

        long closedTickets = tickets.stream()
                .filter(t -> t.getStatus() == TicketStatus.CLOSED)
                .count();

        long inProgressTickets = tickets.stream()
                .filter(t -> t.getStatus() == TicketStatus.IN_PROGRESS)
                .count();

        long criticalTickets = tickets.stream()
                .filter(t -> t.getPriority() != null)
                .filter(t -> t.getPriority().equalsIgnoreCase("Critical"))
                .count();

        long highPriorityTickets = tickets.stream()
                .filter(t -> t.getPriority() != null)
                .filter(t -> t.getPriority().equalsIgnoreCase("High"))
                .count();

        long escalatedTickets = tickets.stream()
                .filter(Ticket::isEscalated)
                .count();

        return new DashboardSummaryResponse(
                totalTickets,
                openTickets,
                closedTickets,
                inProgressTickets,
                criticalTickets,
                highPriorityTickets,
                escalatedTickets
        );
    }

    // =====================================
    // Category Analytics
    // =====================================

    public List<CategoryCountResponse> getCategoryAnalytics() {

        Map<String, Long> map = ticketRepository.findAll()
                .stream()
                .filter(ticket -> ticket.getCategory() != null)
                .filter(ticket -> !ticket.getCategory().isBlank())
                .collect(Collectors.groupingBy(
                        Ticket::getCategory,
                        Collectors.counting()
                ));

        return map.entrySet()
                .stream()
                .map(e -> new CategoryCountResponse(
                        e.getKey(),
                        e.getValue()
                ))
                .toList();
    }

    // =====================================
    // Priority Analytics
    // =====================================

    public List<PriorityCountResponse> getPriorityAnalytics() {

        Map<String, Long> map = ticketRepository.findAll()
                .stream()
                .filter(ticket -> ticket.getPriority() != null)
                .filter(ticket -> !ticket.getPriority().isBlank())
                .collect(Collectors.groupingBy(
                        Ticket::getPriority,
                        Collectors.counting()
                ));

        return map.entrySet()
                .stream()
                .map(e -> new PriorityCountResponse(
                        e.getKey(),
                        e.getValue()
                ))
                .toList();
    }

    // =====================================
    // Team Analytics
    // =====================================

    public List<TeamCountResponse> getTeamAnalytics() {

        Map<String, Long> map = ticketRepository.findAll()
                .stream()
                .filter(ticket -> ticket.getAssignedTeam() != null)
                .filter(ticket -> !ticket.getAssignedTeam().isBlank())
                .collect(Collectors.groupingBy(
                        Ticket::getAssignedTeam,
                        Collectors.counting()
                ));

        return map.entrySet()
                .stream()
                .map(e -> new TeamCountResponse(
                        e.getKey(),
                        e.getValue()
                ))
                .toList();
    }

}