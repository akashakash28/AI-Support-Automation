package com.akash.aisupportautomation.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.akash.aisupportautomation.model.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {

    // Pagination
    Page<Ticket> findAll(Pageable pageable);

    // Search By Status
    Page<Ticket> findByStatus(
            com.akash.aisupportautomation.model.TicketStatus status,
            Pageable pageable);

    // Search By Category
    Page<Ticket> findByCategory(
            String category,
            Pageable pageable);

    // Search By Priority
    Page<Ticket> findByPriority(
            String priority,
            Pageable pageable);

    // Search By Assigned Agent
    Page<Ticket> findByAssignedAgent(
            String assignedAgent,
            Pageable pageable);

    // Duplicate Checking
    java.util.List<Ticket> findByCreatedAtAfter(java.time.LocalDateTime date);
    
    // SLA Escalaion Checking
    java.util.List<Ticket> findByStatusNotAndIsEscalatedFalse(com.akash.aisupportautomation.model.TicketStatus status);

    // AI Dashboard support
    long countByStatusNot(com.akash.aisupportautomation.model.TicketStatus status);
}