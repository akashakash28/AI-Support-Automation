package com.akash.aisupportautomation.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

import com.akash.aisupportautomation.dto.AIResponse;
import com.akash.aisupportautomation.dto.ChatRequest;
import com.akash.aisupportautomation.dto.ChatResponse;
import com.akash.aisupportautomation.service.AIService;

@RestController
@RequestMapping("/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    // ==========================================
    // AI Ticket Classification Test
    // ==========================================

    @GetMapping("/test")
    public AIResponse test() {

        return aiService.analyzeTicket(
                "Internet not working",
                "WiFi disconnects every 5 minutes",
                null);
    }

    // ==========================================
    // AI Chat Assistant
    // ==========================================

    @PostMapping("/chat")
    public ChatResponse chat(
            @Validated
            @RequestBody ChatRequest request) {

        return aiService.chatWithAI(request.getQuestion(), request.getHistory());
    }

    // ==========================================
    // Phase 7: AI Ops Dashboard & Agent Copilot
    // ==========================================

    @GetMapping("/dashboard-insights")
    public Map<String, String> getDashboardInsights() {
        String insights = aiService.generateDashboardInsights();
        return java.util.Map.of("insights", insights);
    }

    @GetMapping("/ticket-draft/{id}")
    public Map<String, String> getTicketDraft(@org.springframework.web.bind.annotation.PathVariable Integer id) {
        String draft = aiService.draftAgentResponse(id);
        return java.util.Map.of("draft", draft);
    }

}