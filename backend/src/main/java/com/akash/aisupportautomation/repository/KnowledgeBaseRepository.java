package com.akash.aisupportautomation.repository;

import com.akash.aisupportautomation.model.KnowledgeBaseArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KnowledgeBaseRepository extends JpaRepository<KnowledgeBaseArticle, Integer> {
}
