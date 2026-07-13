# AI Support Automation - Architecture & Design Document

## 1. Project Overview
The AI Support Automation platform is an enterprise-grade Helpdesk system that minimizes human intervention by deploying a Local LLM (Llama 3 / Qwen) to autonomously triage, prioritize, route, and resolve employee IT issues.

## 2. Technology Stack Justification & Alternatives

### Backend: Spring Boot (Java)
- **Why it is used**: Provides robust multithreading, enterprise-level security (Spring Security + JWT), and seamless integration with relational databases via JPA/Hibernate.
- **Why not alternatives? (Node.js / Python)**: Node.js is single-threaded and can struggle with heavy concurrent I/O when processing large AI payloads simultaneously. Python is excellent for AI, but integrating a full enterprise RBAC system is less standardized than Spring Security. By calling the AI via a local HTTP API (Ollama), Spring Boot can handle the enterprise logic while decoupling the heavy AI compute.
- **Fault Tolerance**: If the API crashes, Spring Boot's internal Tomcat server can gracefully restart isolated threads.

### Frontend: React + Vite
- **Why it is used**: React's component-based architecture allows for highly reusable UI elements (like the glassmorphism cards). Vite provides lightning-fast Hot Module Replacement (HMR) and optimized build sizes.
- **Why not alternatives? (Angular / Vue)**: Angular is highly opinionated and often requires too much boilerplate for a dashboard of this size. React offers a massive ecosystem (e.g., `react-markdown` for parsing AI outputs) which accelerates development.

### Database: MySQL
- **Why it is used**: Relational data integrity is critical for a ticketing system (e.g., ensuring a Ticket strictly belongs to a User, and Comments strictly belong to a Ticket).
- **Why not alternatives? (MongoDB / NoSQL)**: NoSQL databases lack strict schema enforcement and ACID compliance out of the box, which can lead to orphaned tickets or broken foreign key relationships in a highly transactional Helpdesk environment.

### AI Engine: Local Ollama (Qwen / Llama)
- **Why it is used**: Data Privacy. Enterprise IT tickets contain highly sensitive corporate data, credentials, and infrastructure details. Sending this to OpenAI (ChatGPT) poses a massive security risk. Running Ollama locally ensures zero data leakage.
- **Fault Tolerance**: If the AI engine goes offline, the `AIService.java` has a built-in `catch` block that automatically falls back to assigning the ticket to the "General" category with a "Medium" priority, ensuring the ticketing workflow NEVER halts even if the AI crashes.

## 3. Workflow & Component Breakdown

### 3.1 Role-Based Access Control (RBAC) & JWT
- **Implementation**: `JwtFilter.java` intercepts every incoming HTTP request, extracts the Bearer token, and verifies the cryptographic signature.
- **Security Check**: This prevents "Insecure Direct Object Reference" (IDOR). If an Employee tries to access `/api/admin/dashboard`, the JWT filter instantly rejects it before it even hits the controller.

### 3.2 Dual-Portal Architecture
- **Employee Portal**: A streamlined interface focusing solely on issue resolution. The primary view is `AIChat.jsx`, styled with modern glassmorphism. It forces employees to interact with the AI first to attempt autonomous resolution.
- **Admin Console**: A heavy-data dashboard showing AI routing analytics, SLA deadlines, and team assignments. It features a Sidebar layout to maximize vertical screen real estate for data tables.

### 3.3 Autonomous Dispatching (Auto-Routing)
- **How it works**: When a ticket is created (either manually or escalated from the chat), the backend synchronously sends the description to the LLM with a strict JSON-schema prompt.
- **Why this method?**: By enforcing JSON output from the AI, we can deserialize it directly into a Java DTO (`AIResponse.class`) and instantly inject it into the MySQL database, bypassing human dispatchers entirely.

## 4. Resilience & Fallback Strategies (What if it fails?)
- **Database Failure**: The application uses HikariCP connection pooling. If the DB drops momentarily, Hikari will queue requests and retry connections automatically.
- **AI Server Failure**: Handled via hardcoded fallback logic in `AIService.java`. The system degrades gracefully from "AI-Assisted" to a "Standard Helpdesk" without throwing 500 errors to the user.
- **Frontend Routing Failure**: `App.jsx` implements a catch-all `*` route that redirects broken URLs to a beautifully styled `NotFound.jsx` component, maintaining the premium UX even during user error.

## 5. Conclusion
This architecture is optimized for **Data Privacy, High Availability, and Minimal Human Intervention**. Every inch of the codebase has been structured to separate concerns, ensuring that the AI layer, the Business Logic layer, and the Presentation layer can be scaled independently.
