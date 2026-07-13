package com.akash.aisupportautomation.controller;

import com.akash.aisupportautomation.model.KnowledgeBaseArticle;
import com.akash.aisupportautomation.repository.KnowledgeBaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/knowledge-base")
public class KnowledgeBaseController {

    @Autowired
    private KnowledgeBaseRepository knowledgeBaseRepository;

    @GetMapping
    public ResponseEntity<List<KnowledgeBaseArticle>> getAllArticles() {
        return ResponseEntity.ok(knowledgeBaseRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KnowledgeBaseArticle> getArticleById(@PathVariable Integer id) {
        return knowledgeBaseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
