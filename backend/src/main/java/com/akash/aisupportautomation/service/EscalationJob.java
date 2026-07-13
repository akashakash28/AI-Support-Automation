package com.akash.aisupportautomation.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.akash.aisupportautomation.model.Notification;
import com.akash.aisupportautomation.model.Ticket;
import com.akash.aisupportautomation.model.TicketStatus;
import com.akash.aisupportautomation.model.Role;
import com.akash.aisupportautomation.model.User;
import com.akash.aisupportautomation.repository.NotificationRepository;
import com.akash.aisupportautomation.repository.TicketRepository;
import com.akash.aisupportautomation.repository.UserRepository;

@Component
public class EscalationJob {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Run every 1 minute for testing purposes, but usually every 5 mins in production
    @Scheduled(fixedRate = 60000)
    public void checkSlaBreaches() {
        System.out.println("Running SLA Escalation Check at " + LocalDateTime.now());

        // Get all tickets that are not closed and not already escalated
        List<Ticket> activeTickets = ticketRepository.findByStatusNotAndIsEscalatedFalse(TicketStatus.CLOSED);

        LocalDateTime now = LocalDateTime.now();

        for (Ticket ticket : activeTickets) {
            if (ticket.getSlaDeadline() != null && now.isAfter(ticket.getSlaDeadline())) {
                
                System.out.println("ESCALATING TICKET: " + ticket.getId());

                // Mark as escalated
                ticket.setEscalated(true);
                // Also increase priority if it's not already critical
                if (!"Critical".equalsIgnoreCase(ticket.getPriority())) {
                    ticket.setPriority("Critical");
                }

                ticketRepository.save(ticket);

                // Notify all Admins
                List<User> admins = userRepository.findByRole(Role.ADMIN);
                for (User admin : admins) {
                    
                    // Save notification to DB
                    Notification notification = new Notification(
                        admin.getEmail(), 
                        "URGENT: SLA BREACH - Ticket #" + ticket.getId() + " '" + ticket.getTitle() + "' has breached its SLA."
                    );
                    notificationRepository.save(notification);

                    // Send Email
                    emailService.sendEmail(
                        admin.getEmail(),
                        "URGENT: SLA Breach for Ticket #" + ticket.getId(),
                        "Hello " + admin.getName() + ",\n\n" +
                        "Ticket #" + ticket.getId() + " (" + ticket.getTitle() + ") has breached its Service Level Agreement deadline.\n\n" +
                        "It has been automatically escalated to Critical priority.\n\n" +
                        "Please assign an agent immediately.\n\n" +
                        "AI Support Automation"
                    );
                }
            }
        }
    }
}
