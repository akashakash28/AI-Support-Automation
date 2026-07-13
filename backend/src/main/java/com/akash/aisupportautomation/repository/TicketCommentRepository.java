package com.akash.aisupportautomation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.akash.aisupportautomation.model.TicketComment;

public interface TicketCommentRepository
        extends JpaRepository<TicketComment, Integer> {

    List<TicketComment> findByTicketIdOrderByCreatedAtAsc(Integer ticketId);

}