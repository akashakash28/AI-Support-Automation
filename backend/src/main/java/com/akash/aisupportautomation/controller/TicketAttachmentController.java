package com.akash.aisupportautomation.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.akash.aisupportautomation.model.TicketAttachment;
import com.akash.aisupportautomation.service.TicketAttachmentService;

@RestController
public class TicketAttachmentController {

    @Autowired
    private TicketAttachmentService attachmentService;

    // Upload Attachment
    @PostMapping("/tickets/{ticketId}/attachments")
    public TicketAttachment uploadAttachment(
            @PathVariable Integer ticketId,
            @RequestParam("file") MultipartFile file)
            throws IOException {

        return attachmentService.uploadFile(ticketId, file);
    }

    // Get Attachments
    @GetMapping("/tickets/{ticketId}/attachments")
    public List<TicketAttachment> getAttachments(
            @PathVariable Integer ticketId) {

        return attachmentService.getAttachments(ticketId);
    }
}