package com.akash.aisupportautomation.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.akash.aisupportautomation.model.Ticket;
import com.akash.aisupportautomation.model.TicketStatus;
import com.akash.aisupportautomation.repository.TicketRepository;

class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private TicketService ticketService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateTicket() {

        // Arrange
        Ticket ticket = new Ticket();

        ticket.setTitle("VPN not working");
        ticket.setDescription("Unable to connect");
        ticket.setPriority("High");
        ticket.setEmployeeName("Akash");
        ticket.setEmployeeEmail("test@gmail.com");

        when(ticketRepository.save(any(Ticket.class)))
                .thenReturn(ticket);

        // Act
        Ticket savedTicket = ticketService.addTicket(ticket);

        // Assert
        assertNotNull(savedTicket);

        assertEquals(
                "Network",
                savedTicket.getCategory());

        assertEquals(
                "High",
                savedTicket.getPriority());

        assertEquals(
                TicketStatus.OPEN,
                savedTicket.getStatus());

        verify(ticketRepository, times(1))
                .save(any(Ticket.class));

        verify(emailService, times(1))
                .sendEmail(
                        anyString(),
                        anyString(),
                        anyString());
    }
}