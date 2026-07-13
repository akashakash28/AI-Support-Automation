package com.akash.aisupportautomation.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import com.akash.aisupportautomation.model.Notification;
import com.akash.aisupportautomation.repository.NotificationRepository;

@RestController
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    // ==========================
    // Get All Notifications for Logged-in User
    // ==========================
    @GetMapping("/notifications")
    public List<Notification> getAllNotifications(Principal principal) {
        String email = principal.getName();
        return notificationRepository.findByUserEmailOrderByCreatedAtDesc(email);
    }

    // ==========================
    // Get Unread Notification Count
    // ==========================
    @GetMapping("/notifications/unread-count")
    public Map<String, Long> getUnreadCount(Principal principal) {
        String email = principal.getName();
        long count = notificationRepository.countByUserEmailAndIsReadFalse(email);
        Map<String, Long> result = new HashMap<>();
        result.put("count", count);
        return result;
    }

    // ==========================
    // Mark Single Notification as Read
    // ==========================
    @PutMapping("/notifications/{id}/read")
    public Notification markAsRead(@PathVariable Integer id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    // ==========================
    // Mark All Notifications as Read
    // ==========================
    @PutMapping("/notifications/read-all")
    public List<Notification> markAllAsRead(Principal principal) {
        String email = principal.getName();
        List<Notification> unread = notificationRepository
                .findByUserEmailAndIsReadFalseOrderByCreatedAtDesc(email);
        for (Notification notification : unread) {
            notification.setRead(true);
        }
        return notificationRepository.saveAll(unread);
    }
}
