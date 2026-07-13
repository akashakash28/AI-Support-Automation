package com.akash.aisupportautomation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.akash.aisupportautomation.model.TicketAttachment;

public interface TicketAttachmentRepository
        extends JpaRepository<TicketAttachment, Integer> {

    List<TicketAttachment> findByTicketId(Integer ticketId);

}