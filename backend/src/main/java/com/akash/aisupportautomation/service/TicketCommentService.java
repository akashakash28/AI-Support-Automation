package com.akash.aisupportautomation.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.akash.aisupportautomation.exception.ResourceNotFoundException;
import com.akash.aisupportautomation.model.Ticket;
import com.akash.aisupportautomation.model.TicketComment;
import com.akash.aisupportautomation.repository.TicketCommentRepository;

@Service
public class TicketCommentService {

    @Autowired
    private TicketCommentRepository ticketCommentRepository;

    @Autowired
    private com.akash.aisupportautomation.repository.TicketRepository ticketRepository;

    @Autowired
    private AIService aiService;

    @Autowired
    private TicketService ticketService;

    // Add Comment
    public TicketComment addComment(Integer ticketId,
                                    TicketComment comment) {

        Ticket ticket = ticketService.getTicketById(ticketId);

        if (ticket == null) {
            throw new ResourceNotFoundException(
                    "Ticket not found with ID : " + ticketId);
        }

        comment.setTicketId(ticketId);
        comment.setCreatedAt(LocalDateTime.now());

        // Phase 6: AI Sentiment Analysis
        if (comment.getMessage() != null && !comment.getMessage().isBlank()) {
            boolean isAngry = aiService.analyzeSentiment(comment.getMessage());
            if (isAngry && !ticket.isEscalated()) {
                ticket.setPriority("Critical");
                ticket.setEscalated(true);
                // Optionally assign to a Manager or Admin, but leaving as is for now
                ticket.setResolutionRemarks(ticket.getResolutionRemarks() != null ? 
                    ticket.getResolutionRemarks() + "\n[AI ALERT]: Escalated due to severe user sentiment." : 
                    "[AI ALERT]: Escalated due to severe user sentiment.");
                
                ticketRepository.save(ticket);
            }
        }

        return ticketCommentRepository.save(comment);
    }

    // Get Comments
    public List<TicketComment> getComments(Integer ticketId) {

        ticketService.getTicketById(ticketId);

        return ticketCommentRepository
                .findByTicketIdOrderByCreatedAtAsc(ticketId);
    }
}