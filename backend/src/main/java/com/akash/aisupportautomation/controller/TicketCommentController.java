package com.akash.aisupportautomation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.akash.aisupportautomation.model.TicketComment;
import com.akash.aisupportautomation.service.TicketCommentService;

@RestController
public class TicketCommentController {

    @Autowired
    private TicketCommentService ticketCommentService;

    // Add Comment
    @PostMapping("/tickets/{ticketId}/comments")
    public TicketComment addComment(
            @PathVariable Integer ticketId,
            @RequestBody TicketComment comment) {

        return ticketCommentService.addComment(ticketId, comment);
    }

    // Get Comments
    @GetMapping("/tickets/{ticketId}/comments")
    public List<TicketComment> getComments(
            @PathVariable Integer ticketId) {

        return ticketCommentService.getComments(ticketId);
    }
}