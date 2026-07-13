package com.akash.aisupportautomation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.akash.aisupportautomation.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    List<Notification> findByUserEmailOrderByCreatedAtDesc(String userEmail);

    List<Notification> findByUserEmailAndIsReadFalseOrderByCreatedAtDesc(String userEmail);

    long countByUserEmailAndIsReadFalse(String userEmail);
}
