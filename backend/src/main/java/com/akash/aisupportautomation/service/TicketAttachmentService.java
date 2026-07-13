package com.akash.aisupportautomation.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.akash.aisupportautomation.exception.ResourceNotFoundException;
import com.akash.aisupportautomation.model.TicketAttachment;
import com.akash.aisupportautomation.repository.TicketAttachmentRepository;

@Service
public class TicketAttachmentService {

    private static final String UPLOAD_DIR = "uploads";

    @Autowired
    private TicketAttachmentRepository attachmentRepository;

    @Autowired
    private TicketService ticketService;

    // Upload File
    public TicketAttachment uploadFile(
            Integer ticketId,
            MultipartFile file) throws IOException {

        ticketService.getTicketById(ticketId);

        Path uploadPath = Paths.get(UPLOAD_DIR);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String uniqueFileName =
                UUID.randomUUID() + "_" + file.getOriginalFilename();

        Path filePath = uploadPath.resolve(uniqueFileName);

        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING);

        TicketAttachment attachment = new TicketAttachment();

        attachment.setTicketId(ticketId);
        attachment.setFileName(file.getOriginalFilename());
        attachment.setFileType(file.getContentType());
        attachment.setFilePath(filePath.toString());
        attachment.setUploadedAt(LocalDateTime.now());

        return attachmentRepository.save(attachment);
    }

    // Get Attachments
    public List<TicketAttachment> getAttachments(Integer ticketId) {

        ticketService.getTicketById(ticketId);

        return attachmentRepository.findByTicketId(ticketId);
    }
}