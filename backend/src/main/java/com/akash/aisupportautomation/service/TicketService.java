package com.akash.aisupportautomation.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.akash.aisupportautomation.dto.AIResponse;
import com.akash.aisupportautomation.dto.UpdateTicketStatusRequest;
import com.akash.aisupportautomation.exception.ResourceNotFoundException;
import com.akash.aisupportautomation.model.Ticket;
import com.akash.aisupportautomation.model.TicketStatus;
import com.akash.aisupportautomation.repository.TicketRepository;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AIService aiService;

    @Autowired
    private com.akash.aisupportautomation.repository.UserRepository userRepository;

    // ==========================================
    // Get All Tickets
    // ==========================================

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // ==========================================
    // Create Ticket
    // ==========================================

    public Ticket addTicket(Ticket ticket) {

        com.akash.aisupportautomation.model.User creator = null;
        if (ticket.getCreatedBy() != null) {
            creator = userRepository.findByEmail(ticket.getCreatedBy()).orElse(null);
        }

        enrichTicketWithAI(ticket, creator);

        if (ticket.getStatus() == null) {
            ticket.setStatus(TicketStatus.OPEN);
        }

        // Phase 3: Duplicate Detection
        // Check tickets from the last 24 hours
        java.time.LocalDateTime yesterday = java.time.LocalDateTime.now().minusHours(24);
        List<Ticket> recentTickets = ticketRepository.findByCreatedAtAfter(yesterday);
        
        for (Ticket recent : recentTickets) {
            if (recent.getId() != null && isDuplicate(ticket.getTitle(), recent.getTitle())) {
                ticket.setParentTicketId(recent.getId());
                // Optional: Auto-resolve or change status for duplicates
                // ticket.setStatus(TicketStatus.CLOSED); 
                ticket.setResolutionRemarks("Auto-flagged as duplicate of Ticket #" + recent.getId());
                break; // Stop at first duplicate found
            }
        }

        // Phase 3: SLA Calculation
        calculateSLA(ticket);

        Ticket savedTicket = ticketRepository.save(ticket);

        emailService.sendEmail(
                "aisupportautomation9project@gmail.com",
                "Ticket Created Successfully",
                "Hello,\n\n"
                        + "Your ticket has been created successfully.\n\n"
                        + "Title : " + savedTicket.getTitle() + "\n"
                        + "Status : " + savedTicket.getStatus() + "\n"
                        + "Category : " + savedTicket.getCategory() + "\n"
                        + "Priority : " + savedTicket.getPriority() + "\n"
                        + "Assigned Team : " + savedTicket.getAssignedTeam() + "\n"
                        + (savedTicket.getParentTicketId() != null ? "NOTE: This has been flagged as a duplicate of Ticket #" + savedTicket.getParentTicketId() + "\n" : "")
                        + "\n\n"
                        + "Regards,\n"
                        + "AI Support Automation");

        return savedTicket;
    }

    private boolean isDuplicate(String title1, String title2) {
        if (title1 == null || title2 == null) return false;
        // Simple Jaccard similarity or word match could go here
        // For simplicity, if > 60% of words > 4 chars match, it's a duplicate
        String[] words1 = title1.toLowerCase().split("\\W+");
        String[] words2 = title2.toLowerCase().split("\\W+");
        
        long matchCount = 0;
        long totalSignificantWords = 0;
        
        for (String w1 : words1) {
            if (w1.length() > 3) {
                totalSignificantWords++;
                for (String w2 : words2) {
                    if (w1.equals(w2)) {
                        matchCount++;
                        break;
                    }
                }
            }
        }
        
        if (totalSignificantWords == 0) return false;
        return ((double) matchCount / totalSignificantWords) > 0.6;
    }

    private void calculateSLA(Ticket ticket) {
        if (ticket.getPriority() == null) {
            ticket.setSlaDeadline(java.time.LocalDateTime.now().plusHours(24));
            return;
        }
        
        switch (ticket.getPriority().toLowerCase()) {
            case "critical":
                ticket.setSlaDeadline(java.time.LocalDateTime.now().plusHours(2));
                break;
            case "high":
                ticket.setSlaDeadline(java.time.LocalDateTime.now().plusHours(8));
                break;
            case "medium":
                ticket.setSlaDeadline(java.time.LocalDateTime.now().plusHours(24));
                break;
            case "low":
                ticket.setSlaDeadline(java.time.LocalDateTime.now().plusHours(48));
                break;
            default:
                ticket.setSlaDeadline(java.time.LocalDateTime.now().plusHours(24));
        }
    }

    // ==========================================
    // Get Ticket By Id
    // ==========================================

    public Ticket getTicketById(Integer id) {

        return ticketRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Ticket not found with ID : " + id));
    }

    // ==========================================
    // Update Ticket
    // ==========================================

    public Ticket updateTicket(Integer id, Ticket updatedTicket) {

        Ticket ticket = getTicketById(id);

        ticket.setTitle(updatedTicket.getTitle());
        ticket.setDescription(updatedTicket.getDescription());
        ticket.setPriority(updatedTicket.getPriority());
        ticket.setStatus(updatedTicket.getStatus());
        ticket.setEmployeeName(updatedTicket.getEmployeeName());

        ticket.setCreatedBy(updatedTicket.getCreatedBy());
        ticket.setAssignedAgent(updatedTicket.getAssignedAgent());
        ticket.setResolutionRemarks(updatedTicket.getResolutionRemarks());

        com.akash.aisupportautomation.model.User creator = null;
        if (ticket.getCreatedBy() != null) {
            creator = userRepository.findByEmail(ticket.getCreatedBy()).orElse(null);
        }

        enrichTicketWithAI(ticket, creator);

        return ticketRepository.save(ticket);
    }

    // ==========================================
    // Update Status Only
    // ==========================================

    public Ticket updateTicketStatus(
            Integer id,
            UpdateTicketStatusRequest request) {

        Ticket ticket = getTicketById(id);

        ticket.setStatus(request.getStatus());

        return ticketRepository.save(ticket);
    }

    // ==========================================
    // Assign Ticket
    // ==========================================

    public Ticket assignTicket(
            Integer ticketId,
            String assignedAgent) {

        Ticket ticket = getTicketById(ticketId);

        ticket.setAssignedAgent(assignedAgent);

        Ticket updatedTicket = ticketRepository.save(ticket);

        if (updatedTicket.getEmployeeEmail() != null &&
                !updatedTicket.getEmployeeEmail().isBlank()) {

            emailService.sendEmail(

                    updatedTicket.getEmployeeEmail(),

                    "Ticket Assigned",

                    "Hello " + updatedTicket.getEmployeeName() + ",\n\n"

                            + "Your ticket has been assigned.\n\n"

                            + "Ticket ID : " + updatedTicket.getId() + "\n"

                            + "Title : " + updatedTicket.getTitle() + "\n"

                            + "Assigned Agent : " + updatedTicket.getAssignedAgent() + "\n"

                            + "Category : " + updatedTicket.getCategory() + "\n"

                            + "Priority : " + updatedTicket.getPriority() + "\n"

                            + "Status : " + updatedTicket.getStatus()

                            + "\n\nRegards,\n"

                            + "AI Support Automation");
        }

        return updatedTicket;
    }

    @Autowired
    private com.akash.aisupportautomation.repository.KnowledgeBaseRepository knowledgeBaseRepository;

    // ==========================================
    // Resolve Ticket
    // ==========================================

    public Ticket resolveTicket(
            Integer ticketId,
            String resolutionRemarks) {

        Ticket ticket = getTicketById(ticketId);

        ticket.setResolutionRemarks(resolutionRemarks);
        ticket.setStatus(TicketStatus.CLOSED);

        Ticket updatedTicket = ticketRepository.save(ticket);

        // Phase 6: KB Auto-Generation
        new Thread(() -> {
            try {
                String kbContent = aiService.generateKBArticle(
                        ticket.getDescription(),
                        resolutionRemarks
                );

                String kbTitle = "How to resolve: " + ticket.getTitle();

                com.akash.aisupportautomation.model.KnowledgeBaseArticle article = 
                    new com.akash.aisupportautomation.model.KnowledgeBaseArticle(
                        kbTitle,
                        kbContent,
                        ticket.getCategory(),
                        ticket.getId()
                );

                knowledgeBaseRepository.save(article);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();

     return updatedTicket;
    }

    // ==========================================
    // Delete Ticket
    // ==========================================

    public String deleteTicket(Integer id) {

        getTicketById(id);

        ticketRepository.deleteById(id);

        return "Ticket deleted successfully";
    }

    // ==========================================
    // Dashboard
    // ==========================================

    public long getTotalTickets() {
        return ticketRepository.count();
    }

    public long getOpenTickets() {

        return ticketRepository.findAll()
                .stream()
                .filter(ticket -> ticket.getStatus() == TicketStatus.OPEN)
                .count();
    }

    public long getClosedTickets() {

        return ticketRepository.findAll()
                .stream()
                .filter(ticket -> ticket.getStatus() == TicketStatus.CLOSED)
                .count();
    }

    public long getHighPriorityTickets() {

        return ticketRepository.findAll()
                .stream()
                .filter(ticket ->
                        ticket.getPriority() != null &&
                        ticket.getPriority().equalsIgnoreCase("High"))
                .count();
    }

    public long getNetworkTickets() {

        return ticketRepository.findAll()
                .stream()
                .filter(ticket ->
                        ticket.getCategory() != null &&
                        ticket.getCategory().equalsIgnoreCase("Network"))
                .count();
    }

    // ==========================================
    // Pagination
    // ==========================================

    public Page<Ticket> getTickets(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return ticketRepository.findAll(pageable);
    }

    // ==========================================
    // Search By Status
    // ==========================================

    public Page<Ticket> getTicketsByStatus(
            TicketStatus status,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);

        return ticketRepository.findByStatus(status, pageable);
    }

    // ==========================================
    // Search By Category
    // ==========================================

    public Page<Ticket> getTicketsByCategory(
            String category,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);

        return ticketRepository.findByCategory(category, pageable);
    }

    // ==========================================
    // Search By Priority
    // ==========================================

    public Page<Ticket> getTicketsByPriority(
            String priority,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);

        return ticketRepository.findByPriority(priority, pageable);
    }

    // ==========================================
    // Search By Assigned Agent
    // ==========================================

    public Page<Ticket> getTicketsByAssignedAgent(
            String assignedAgent,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);

        return ticketRepository.findByAssignedAgent(
                assignedAgent,
                pageable);
    }

    // ==========================================
    // AI Ticket Classification
    // ==========================================

    private void enrichTicketWithAI(Ticket ticket, com.akash.aisupportautomation.model.User creator) {
        try {
            AIResponse ai = aiService.analyzeTicket(
                    ticket.getTitle(),
                    ticket.getDescription(),
                    creator
            );

            ticket.setCategory(ai.getCategory() != null ? ai.getCategory() : "General");
            ticket.setPriority(ai.getPriority() != null ? ai.getPriority() : "Medium");
            ticket.setAssignedTeam(ai.getAssignedTeam() != null ? ai.getAssignedTeam() : "IT Support Team");
            
            // Phase 4 additions
            ticket.setTicketType(ai.getTicketType() != null ? ai.getTicketType() : "ISSUE");
            ticket.setAiApproved(ai.getAiApproved());
            
            if ("RESOURCE_REQUEST".equalsIgnoreCase(ticket.getTicketType())) {
                if (Boolean.TRUE.equals(ticket.getAiApproved())) {
                    ticket.setStatus(TicketStatus.CLOSED);
                    ticket.setAiSuggestion("AI Auto-Approved resource based on Job Role.");
                    ticket.setResolutionRemarks("Auto-approved based on employee title.");
                } else {
                    ticket.setStatus(TicketStatus.WAITING_FOR_USER);
                    ticket.setAiSuggestion("Requires Human Manager Approval. " + (ai.getSuggestion() != null ? ai.getSuggestion() : ""));
                }
            } else {
                ticket.setAiSuggestion(ai.getSuggestion() != null ? ai.getSuggestion() : "AI analysis unavailable.");
            }

        } catch (Exception e) {
            // Fallback values if AI analysis fails entirely
            ticket.setCategory("General");
            ticket.setPriority("Medium");
            ticket.setAssignedTeam("IT Support Team");
            ticket.setTicketType("ISSUE");
            ticket.setAiSuggestion("AI analysis unavailable.");
        }
    }
}