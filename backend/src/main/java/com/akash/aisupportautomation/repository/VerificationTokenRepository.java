package com.akash.aisupportautomation.repository;

import com.akash.aisupportautomation.model.VerificationToken;
import com.akash.aisupportautomation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Integer> {
    Optional<VerificationToken> findByToken(String token);
    void deleteByUser(User user);
}
