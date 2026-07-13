package com.akash.aisupportautomation.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.akash.aisupportautomation.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    java.util.List<User> findByRole(com.akash.aisupportautomation.model.Role role);

}