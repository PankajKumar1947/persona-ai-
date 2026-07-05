# Persona AI

Persona AI is an AI-powered developer pairing studio designed to simulate conversations with two prominent software mentors and educators from the Indian tech community: **Hitesh Choudhary** (creator of *Chai aur Code*) and **Piyush Garg**. The interface simulates a dark-mode developer console where users can toggle between different personalities and receive responses that mimic their exact teaching style, vocabulary, and tones.

- **Live Deployed Website**: [https://personaai-hp.vercel.app/](https://personaai-hp.vercel.app/)
- **GitHub Repository**: [https://github.com/PankajKumar1947/persona-ai-.git](https://github.com/PankajKumar1947/persona-ai-.git)

---

## Features

- **Interactive Persona Selection**: Switch between **Hitesh** (warm, Hinglish, tea-themed analogies, peer-focused advice) and **Piyush** (direct, technical, system/deployment focus, senior developer vibe).
- **Collapsible Pipeline Steps Panel**: Shows the model's sequential execution steps (`[INITIAL]`, `[THINK]`, `[ANALYSE]`) in real-time, which auto-collapses once the final output begins streaming.
- **Copy-Capabale Code Blocks**: Fully styled markdown-supported terminal block outputs with a working "Copy" clipboard button.
- **Robust Markdown Parsing**: Custom styling overrides using `react-markdown` to render headers, nested lists, bullet points, bold tags, and inline backticks.
- **Secure Server-Side LLM Execution**: Resolves API connections strictly via server-side environment variables (`MISTRAL_API_KEY`) pointing directly to the OpenAI-compatible Mistral API (`https://api.mistral.ai/v1` using `mistral-large-latest`).

---

## Persona Data Collection & Preparation

To replicate both personas authentically, public material was analyzed including:
- **Hitesh Choudhary**: YouTube video content transcripts from *Chai aur Code*, tweets, replies, and personal portfolio site details (`hitesh.ai`).
  - *Key findings*: Frequently starts replies/videos with "Haan Ji". Avoids generic terms like "dosto" (uses "my friends" or speaks directly in Hinglish). Integrates informal tea breaks ("chai shai ہو gayi?") and cautions learners against getting stuck in "tutorial loops" (advocating "learn by building").
- **Piyush Garg**: Technical blogs, YouTube courses, and portfolio pages (`piyushgarg.dev`).
  - *Key findings*: Prefers directly jumping to code blocks using the catchphrase "Directly code pe chalte hain." Uses terms like "Production-ready build", "internals", and "Dockerizing Node backend". Prefers a supportive, clear senior engineer developer vibe over conversational fluff, addressing questions direct-to-the-point.

---

## Prompt Engineering Strategy

We implement a structured pipeline logic to guarantee high reasoning quality and prevent output truncation:
1. **Pipeline Tags**: The LLM is instructed to structure its output across four tags:
   - `[INITIAL]`: Evaluates the user's intent.
   - `[THINK]`: Outlines the teaching/conceptual structure.
   - `[ANALYSE]`: Validates performance logic or tone checks.
   - `[OUTPUT]`: The actual persona conversational text.
2. **Loop-Controlled Generation**: In the Next.js API route (`app/api/chat/route.ts`), instead of pulling all tags in a single prompt (which often causes model truncation and tag-bleeding), the backend loops through the sequence `["INITIAL", "THINK", "ANALYSE", "OUTPUT"]`. For each step, it feeds the previous steps' results back to the LLM and requests the targeted completion chunk, streaming the tokens down the stream connection.
3. **UI Stream Parsing**: The frontend parses the streaming chunks in real-time. If it detects `[INITIAL]`, `[THINK]`, or `[ANALYSE]` tags, it renders them inside an expandable console-style log box. When `[OUTPUT]` begins, it automatically collapses the console logs box to display the primary Markdown content bubble clearly.

---

## Context Management Approach

- **Sliding History Buffer**: Maintained dynamically on the frontend and backend.
- **Dynamic Context Length**: Restricts context to the last `N` messages to avoid bloated requests and keep token counts within budget.
- **System Prompt Reinforcement**: On each new request, the system prompt is appended at the top of the history to reinforce pipeline tags and persona rules.

---

## Sample Conversations

### Hitesh Choudhary
- **User Prompt**: *"Should I learn Rust?"*
- **Model Steps**:
  - `[INITIAL]`: User is asking if they should learn Rust.
  - `[THINK]`: I will explain Rust's memory safety but remind them to learn by building, rather than just tutorial collecting.
  - `[ANALYSE]`: Keep it encouraging, suggest having a cup of tea.
  - `[OUTPUT]`: Haan Ji, Rust learn karna is awesome! Memory safety, speed, systems programming, sab kamaal hai. Par ek baat dhyan mein rakho: sirf tutorials collect mat karo. Likh ke code seekha jata hai, sirf dekhne se nahi! Ek cup chai peeyo, and construct a small CLI tool or a web server in Rust. Love this approach, keep building!

### Piyush Garg
- **User Prompt**: *"How to reduce docker image size?"*
- **Model Steps**:
  - `[INITIAL]`: User wants to minimize Docker container image sizes.
  - `[THINK]`: I'll explain multi-stage docker builds.
  - `[ANALYSE]`: Best practice for Node.js production deployments.
  - `[OUTPUT]`: Hey guys! Piyush here. Image size reduction ke liye simple solution is multi-stage builds. Directly code pe chalte hain. Check this multi-stage setup:
    ```dockerfile
    FROM node:18-alpine AS builder
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY . .
    RUN npm run build

    FROM node:18-alpine
    WORKDIR /app
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/package*.json ./
    RUN npm ci --only=production
    CMD ["node", "dist/main"]
    ```
    Isse build environment tools container image se clean ho jayenge, simple.

---

## Setup and Run Instructions

### Prerequisites
- Node.js (v18.x or later)
- pnpm (recommended) or npm/yarn

### 1. Clone the repository
```bash
git clone https://github.com/PankajKumar1947/persona-ai-.git
cd persona-ai-
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
MISTRAL_API_KEY=your_mistral_api_key_here
```

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
pnpm build
pnpm start
```
