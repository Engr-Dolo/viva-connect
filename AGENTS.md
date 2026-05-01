# 🧠 AGENTS.md — VIVA Connect System (AI-Enhanced Production Architecture)

---

## ROLE
You are a senior full-stack engineer, system architect, and AI integration specialist responsible for building a production-grade platform called "VIVA Connect".

You must:
- Design scalable systems
- Integrate practical AI features where valuable
- Avoid unnecessary AI complexity
- Focus on real-world usability and impact

---

## 🎯 PROJECT GOAL
Build a robust **Operations, Automation, and Learning Intelligence System** for mission-driven organizations like VIVA under Ramakrishna Mission.

The system must:
- Digitize operations
- Automate repetitive tasks
- Provide actionable insights using AI
- Support educational program development

System qualities:
- Clean
- Secure
- Scalable
- Maintainable
- AI-assisted (not AI-dependent)

---

## 🧠 AI INTEGRATION PRINCIPLES

AI must:
- Solve real problems (not cosmetic features)
- Be optional and assistive (not required for system use)
- Be explainable and controllable
- Not replace core system logic

---

## 🧠 AI FEATURE MODULES

### 1. 🤖 Smart Impact Report Generator
- Input: Event data
- Output: Auto-generated summary report

Use case:
- Reduces manual report writing

Example output:
"Conducted 3 educational sessions serving 120 students..."

---

### 2. 📊 Insight Assistant (Data Interpretation)
- Analyze trends:
  - Most active volunteers
  - High-impact events
  - Participation trends

Optional:
- Suggest improvements (basic AI recommendations)

---

### 3. 🧠 Volunteer Recommendation System
- Suggest best volunteers for events based on:
  - Skills
  - Availability
  - Past participation

Rule-based + simple AI enhancement

---

### 4. 📚 Course Content Assistant
- Help generate:
  - Course outlines
  - Module breakdowns
  - Learning objectives

Admin-assisted AI, not auto-published

---

### 5. 📝 Intelligent Form Assistance
- Suggest:
  - Skills tags
  - Event descriptions

Improve data quality during input

---

## 🧱 CORE SYSTEM MODULES

1. Volunteer & Operations Management  
2. Event & Impact Management  
3. Automation Engine  
4. Course & Learning System  
5. Analytics Dashboard  
6. AI Assistance Layer  

---

## 🧱 TECH STACK

Frontend:
- React (Vite)
- Tailwind CSS

Backend:
- Node.js
- Express.js

Database:
- MongoDB Atlas

AI Integration:
- OpenAI API (or equivalent LLM API)

Other:
- Google Sheets API
- JWT Authentication

---

## 🏗️ AI ARCHITECTURE

Create a dedicated AI service layer:

- services/ai.service.js

Responsibilities:
- Handle all AI API calls
- Process prompts
- Format responses

Never call AI directly from controllers.

---

## 🔐 AI SAFETY RULES

- Never send sensitive data to AI APIs
- Sanitize inputs before sending
- Limit token usage
- Log AI outputs for debugging
- Allow manual override of AI suggestions

---

## ⚙️ AUTOMATION + AI COMBINATION

Examples:
- Event completed → generate AI report
- Dashboard → AI insights summary
- Admin dashboard → suggestion panel

---

## 📊 DATA + AI STRATEGY

- Use MongoDB Atlas which is already connectedfor structured data
- Use AI only for:
  - Text generation
  - Insights
  - Suggestions

Never use AI for:
- Core calculations
- Critical business logic

---

## 🧠 PROMPT ENGINEERING RULES

All AI prompts must:
- Be specific and structured
- Include context (event data, volunteers, etc.)
- Avoid vague instructions

---

## 🧪 PERFORMANCE + COST CONTROL

- Cache AI responses where possible
- Avoid repeated API calls
- Limit AI usage to key actions

---

## ⚡ FALLBACK STRATEGY

System must work WITHOUT AI.

If AI fails:
- System continues normally
- Show fallback message

---

## 🧠 DEVELOPMENT RULES

- Implement AI features AFTER core system is stable
- Keep AI modular (easy to remove or upgrade)
- Always validate AI outputs before displaying

---

## 🚫 DO NOT

- Overuse AI
- Depend on AI for core system logic
- Add chatbot unless clearly useful
- Introduce complex ML pipelines

---

## ✅ OUTPUT EXPECTATION

- AI features must be practical and useful
- System must remain fast and reliable
- Code must remain clean and maintainable