package com.akash.aisupportautomation.service;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.akash.aisupportautomation.dto.AIResponse;
import com.akash.aisupportautomation.dto.ChatResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AIService {

    private static final String MODEL = "qwen2.5:1.5b";

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @org.springframework.beans.factory.annotation.Autowired
    private com.akash.aisupportautomation.repository.TicketRepository ticketRepository;

    public AIService() {

        this.objectMapper = new ObjectMapper();

        this.webClient = WebClient.builder()
                .baseUrl("http://localhost:11434")
                .build();
    }

    /*
     * ==========================================================
     * Common Ollama Method
     * ==========================================================
     */
    private String askOllama(String prompt) throws Exception {

        Map<String, Object> body = new HashMap<>();

        body.put("model", MODEL);
        body.put("prompt", prompt);
        body.put("stream", false);

        String response = webClient.post()
                .uri("/api/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(60))
                .block();

        if (response == null) {
            throw new RuntimeException("Empty response from Ollama");
        }

        JsonNode root = objectMapper.readTree(response);

        JsonNode responseNode = root.get("response");

        if (responseNode == null) {
            throw new RuntimeException("Ollama response missing 'response' field.");
        }

        return responseNode.asText().trim();
    }

    /*
     * ==========================================================
     * AI Ticket Analysis
     * ==========================================================
     */

    public AIResponse analyzeTicket(String title, String description, com.akash.aisupportautomation.model.User creator) {

        try {

            String prompt = """
                    You are an experienced IT and HR Manager.

                    Analyze the following support ticket.
                    First, determine the ticketType:
                    - 'ISSUE' (if reporting a problem, error, or breakdown)
                    - 'RESOURCE_REQUEST' (if asking for new hardware, software, access, or licenses)

                    If the ticketType is 'RESOURCE_REQUEST', analyze the Employee's Job Title and Department. 
                    Decide if they truly need this resource.
                    - If yes, set 'aiApproved' to true.
                    - If no or unsure, set 'aiApproved' to false.
                    (If ticketType is 'ISSUE', set 'aiApproved' to null).

                    Return ONLY valid JSON.
                    Do not include markdown or explanations.

                    JSON Format:
                    {
                      "category":"",
                      "priority":"",
                      "assignedTeam":"",
                      "suggestion":"",
                      "ticketType":"",
                      "aiApproved": null
                    }

                    Categories:
                    - Network
                    - Hardware
                    - Software
                    - Security
                    - Email
                    - Printer
                    - Database
                    - Access Request

                    Priorities: Low, Medium, High, Critical

                    Teams: Network Team, IT Support Team, Software Team, Security Team, Database Team, HR Team

                    Employee Details:
                    - Job Title: %s
                    - Department: %s

                    Ticket Title:
                    %s

                    Ticket Description:
                    %s
                    """.formatted(
                        creator != null ? creator.getJobTitle() : "Unknown", 
                        creator != null ? creator.getDepartment() : "Unknown", 
                        title, 
                        description
                    );

            String aiText = askOllama(prompt);

            aiText = aiText
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            // Extract just the JSON part to avoid parse errors if model chatters
            int startIndex = aiText.indexOf('{');
            int endIndex = aiText.lastIndexOf('}');
            if (startIndex >= 0 && endIndex > startIndex) {
                aiText = aiText.substring(startIndex, endIndex + 1);
            }

            System.out.println("\n========== AI Ticket ==========");
            System.out.println(aiText);
            System.out.println("================================\n");

            return objectMapper.readValue(aiText, AIResponse.class);

        } catch (Exception ex) {

            ex.printStackTrace();

            AIResponse fallback = new AIResponse();

            fallback.setCategory("General");
            fallback.setPriority("Medium");
            fallback.setAssignedTeam("IT Support Team");
            fallback.setSuggestion(
                    "AI analysis unavailable. Please review manually.");

            return fallback;
        }
    }

    /*
     * ==========================================================
     * AI Chat Assistant
     * ==========================================================
     */

    public ChatResponse chatWithAI(String question, java.util.List<String> history) {

        try {
            StringBuilder historyStr = new StringBuilder();
            if (history != null && !history.isEmpty()) {
                historyStr.append("\nPrevious Conversation:\n");
                for (String h : history) {
                    historyStr.append("- ").append(h).append("\n");
                }
            }

            String prompt = """
                    You are an expert IT Support Assistant for our company.
                    
                    Your job is to help the employee solve their issue. You MUST act like a professional support agent.
                    If this is the start of a conversation, always greet them and ask for their details (e.g. Employee ID, Email, Role) to verify their credentials before proceeding with a fix.
                    If they have provided their details, acknowledge them and proceed to diagnose the issue step-by-step.
                    Do NOT just give a long wall of text. Ask follow-up questions to pinpoint the exact problem.
                    
                    If you realize the problem requires physical intervention (e.g. broken hardware), backend server access, or you simply cannot solve it, you MUST explicitly state: 
                    "I cannot fix this issue automatically. Please click the 'Escalate to Human' button below to create a support ticket."

                    Keep your answers concise, practical, and conversational.
                    Maximum 150 words per response.
                    %s
                    User's Message:
                    %s
                    """.formatted(historyStr.toString(), question);

            String answer = askOllama(prompt);

            System.out.println("\n========== AI Chat ==========");
            System.out.println(answer);
            System.out.println("==============================\n");

            return new ChatResponse(answer);

        } catch (Exception ex) {

            ex.printStackTrace();

            return new ChatResponse(
                    "Sorry, AI Assistant is currently unavailable. Please try again later.");
        }
    }

    /*
     * ==========================================================
     * AI Sentiment Analysis
     * ==========================================================
     */
    public boolean analyzeSentiment(String comment) {
        try {
            String prompt = """
                    Analyze the sentiment of the following support ticket comment.
                    Does the user sound extremely angry, frustrated, abusive, or highly urgent?
                    Return ONLY 'true' or 'false'.
                    
                    Comment:
                    %s
                    """.formatted(comment);

            String response = askOllama(prompt).toLowerCase().trim();
            return response.contains("true");
        } catch (Exception ex) {
            ex.printStackTrace();
            return false; // Default to false if AI fails
        }
    }

    /*
     * ==========================================================
     * Knowledge Base Generation
     * ==========================================================
     */
    public String generateKBArticle(String issue, String resolution) {
        try {
            String prompt = """
                    You are an expert IT Technical Writer.
                    Your goal is to take a support ticket issue and its resolution, and turn them into a professional Knowledge Base (KB) Article.
                    Use Markdown formatting. Include sections for 'Issue Description', 'Root Cause' (if applicable), and 'Step-by-Step Resolution'.
                    
                    Keep it clear, concise, and helpful for future employees.
                    
                    Original Issue:
                    %s
                    
                    Agent's Resolution:
                    %s
                    """.formatted(issue, resolution);

            return askOllama(prompt);
        } catch (Exception ex) {
            ex.printStackTrace();
            return "Failed to generate Knowledge Base article due to AI service unavailability.";
        }
    }

    /*
     * ==========================================================
     * AI Ops Dashboard Insights
     * ==========================================================
     */
    public String generateDashboardInsights() {
        try {
            long totalOpen = ticketRepository.countByStatusNot(com.akash.aisupportautomation.model.TicketStatus.CLOSED);
            long escalated = ticketRepository.findAll().stream().filter(t -> t.isEscalated() && t.getStatus() != com.akash.aisupportautomation.model.TicketStatus.CLOSED).count();
            
            // Get category counts
            Map<String, Long> categoryCounts = new HashMap<>();
            ticketRepository.findAll().forEach(t -> {
                if (t.getStatus() != com.akash.aisupportautomation.model.TicketStatus.CLOSED && t.getCategory() != null) {
                    categoryCounts.put(t.getCategory(), categoryCounts.getOrDefault(t.getCategory(), 0L) + 1);
                }
            });

            String prompt = """
                    You are an expert AI Operations Manager analyzing a Helpdesk Support System.
                    I will provide you with the current open ticket statistics. 
                    Write a highly concise, actionable plain-English brief (max 3 bullet points) for the human Admin. 
                    Highlight any spikes, potential bottlenecks, or anomalies. If everything is fine, say so.
                    
                    Statistics:
                    - Total Open Tickets: %d
                    - Total Escalated (Urgent/Angry) Tickets: %d
                    - Category Breakdown: %s
                    """.formatted(totalOpen, escalated, categoryCounts.toString());

            return askOllama(prompt);
        } catch (Exception ex) {
            ex.printStackTrace();
            return "AI Insights currently unavailable.";
        }
    }

    /*
     * ==========================================================
     * AI Agent Copilot
     * ==========================================================
     */
    public String draftAgentResponse(Integer ticketId) {
        try {
            com.akash.aisupportautomation.model.Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
            if (ticket == null) return "Ticket not found.";

            String prompt = """
                    You are an AI Copilot assisting a human IT Support Agent.
                    The Agent is about to reply to the user who opened the following ticket.
                    Draft a professional, helpful, and empathetic response for the agent to send.
                    Do NOT include placeholders like [Your Name]. Sign it off as "IT Support Team".
                    Keep it relatively concise.

                    Ticket Title: %s
                    Ticket Description: %s
                    """.formatted(ticket.getTitle(), ticket.getDescription());

            return askOllama(prompt);
        } catch (Exception ex) {
            ex.printStackTrace();
            return "AI Draft currently unavailable.";
        }
    }
}