package com.akash.aisupportautomation.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.akash.aisupportautomation.dto.AssignTicketRequest;
import com.akash.aisupportautomation.dto.ResolveTicketRequest;
import com.akash.aisupportautomation.model.Notification;
import com.akash.aisupportautomation.model.Ticket;
import com.akash.aisupportautomation.model.TicketStatus;
import com.akash.aisupportautomation.repository.NotificationRepository;
import com.akash.aisupportautomation.service.TicketService;

import jakarta.validation.Valid;

@RestController
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private com.akash.aisupportautomation.service.UserService userService;

    @Autowired
    private NotificationRepository notificationRepository;

    // ==========================
    // Get All Tickets (Role Based)
    // ==========================
    @GetMapping("/tickets")
    public List<Ticket> getAllTickets(java.security.Principal principal) {
        List<Ticket> allTickets = ticketService.getAllTickets();
        
        if (principal != null) {
            String email = principal.getName();
            com.akash.aisupportautomation.model.User user = userService.findByEmail(email).orElse(null);
            
            if (user != null && user.getRole() == com.akash.aisupportautomation.model.Role.EMPLOYEE) {
                // Employees can only view tickets they created
                return allTickets.stream()
                        .filter(t -> email.equals(t.getCreatedBy()))
                        .toList();
            } else if (user != null && user.getRole() == com.akash.aisupportautomation.model.Role.SUPPORT_AGENT) {
                // Support Agents can only view tickets assigned to them
                return allTickets.stream()
                        .filter(t -> email.equals(t.getAssignedAgent()))
                        .toList();
            }
        }
        
        // Admins and Support Agents can view all
        return allTickets;
    }

    // ==========================
    // Create Ticket
    // ==========================
    @PostMapping("/tickets")
    public Ticket createTicket(
            @Valid @RequestBody Ticket ticket,
            java.security.Principal principal) {
        
        if (principal != null) {
            String email = principal.getName();
            com.akash.aisupportautomation.model.User user = userService.findByEmail(email).orElse(null);
            if (user != null) {
                ticket.setEmployeeEmail(user.getEmail());
                ticket.setEmployeeName(user.getName());
                ticket.setCreatedBy(user.getEmail());
            }
        }

        Ticket savedTicket = ticketService.addTicket(ticket);
        
        // Notify Managers
        try {
            java.util.List<com.akash.aisupportautomation.model.User> managers = userService.findByRole(com.akash.aisupportautomation.model.Role.MANAGER);
            for (com.akash.aisupportautomation.model.User m : managers) {
                com.akash.aisupportautomation.model.Notification notif = new com.akash.aisupportautomation.model.Notification();
                notif.setMessage("New ticket created: #" + savedTicket.getId() + " - " + savedTicket.getTitle());
                notif.setUserEmail(m.getEmail());
                notif.setRead(false);
                notif.setCreatedAt(java.time.LocalDateTime.now());
                notificationRepository.save(notif);
            }
        } catch(Exception e) {
            e.printStackTrace();
        }

        return savedTicket;
    }

    // ==========================
    // Get Ticket By ID
    // ==========================
    @GetMapping("/tickets/{id}")
    public Ticket getTicketById(
            @PathVariable Integer id) {

        return ticketService.getTicketById(id);
    }

    // ==========================
    // Update Ticket
    // ==========================
    @PutMapping("/tickets/{id}")
    public Ticket updateTicket(
            @PathVariable Integer id,
            @Valid @RequestBody Ticket updatedTicket,
            java.security.Principal principal) {

        Ticket existingTicket = ticketService.getTicketById(id);
        
        if (principal != null) {
            String email = principal.getName();
            com.akash.aisupportautomation.model.User user = userService.findByEmail(email).orElse(null);
            
            if (user != null && user.getRole() == com.akash.aisupportautomation.model.Role.EMPLOYEE) {
                if (!email.equals(existingTicket.getCreatedBy())) {
                    throw new RuntimeException("You are not authorized to update this ticket");
                }
            }
        }

        return ticketService.updateTicket(id, updatedTicket);
    }

    // ==========================
    // Assign Ticket To Agent
    // ==========================
    @PutMapping("/tickets/{id}/assign")
    public Ticket assignTicket(
            @PathVariable Integer id,
            @Valid @RequestBody AssignTicketRequest request) {

        return ticketService.assignTicket(
                id,
                request.getAssignedAgent());
    }
// ==========================
// Resolve Ticket
// ==========================
@PutMapping("/tickets/{id}/resolve")
public Ticket resolveTicket(
        @PathVariable Integer id,
        @Valid @RequestBody ResolveTicketRequest request) {

    return ticketService.resolveTicket(
            id,
            request.getResolutionRemarks());
}

    // ==========================
    // Close Ticket
    // ==========================
    @PutMapping("/tickets/{id}/close")
    public Ticket closeTicket(@PathVariable Integer id, java.security.Principal principal) {
        Ticket ticket = ticketService.getTicketById(id);
        if (principal != null) {
            String email = principal.getName();
            if (!email.equals(ticket.getCreatedBy())) {
                throw new RuntimeException("Only the ticket creator can close this ticket");
            }
        }
        ticket.setStatus(TicketStatus.CLOSED);
        Ticket updated = ticketService.updateTicket(id, ticket);

        // Notify the assigned agent
        if (ticket.getAssignedAgent() != null && !ticket.getAssignedAgent().isEmpty()) {
            Notification notification = new Notification(ticket.getAssignedAgent(),
                    "Ticket #" + id + " '" + ticket.getTitle() + "' has been closed by the employee.");
            notificationRepository.save(notification);
        }
        return updated;
    }

    // ==========================
    // Delete Ticket
    // ==========================
    @DeleteMapping("/tickets/{id}")
    public String deleteTicket(
            @PathVariable Integer id,
            java.security.Principal principal) {

        Ticket existingTicket = ticketService.getTicketById(id);
        
        if (principal != null) {
            String email = principal.getName();
            com.akash.aisupportautomation.model.User user = userService.findByEmail(email).orElse(null);
            
            if (user != null && user.getRole() == com.akash.aisupportautomation.model.Role.EMPLOYEE) {
                if (!email.equals(existingTicket.getCreatedBy())) {
                    throw new RuntimeException("You are not authorized to delete this ticket");
                }
            }
        }

        return ticketService.deleteTicket(id);
    }

    // ==========================
    // Dashboard API
    // ==========================
    @GetMapping("/dashboard")
    public Map<String, Long> getDashboardData() {

        Map<String, Long> dashboard = new HashMap<>();

        dashboard.put(
                "totalTickets",
                ticketService.getTotalTickets());

        dashboard.put(
                "openTickets",
                ticketService.getOpenTickets());

        dashboard.put(
                "closedTickets",
                ticketService.getClosedTickets());

        dashboard.put(
                "highPriorityTickets",
                ticketService.getHighPriorityTickets());

        dashboard.put(
                "networkTickets",
                ticketService.getNetworkTickets());

        return dashboard;
    }
}