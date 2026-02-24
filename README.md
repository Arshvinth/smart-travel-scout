# Smart Travel Scout 🌍

An AI-powered mini web application that recommends the best-matching travel experiences from a fixed inventory using grounded LLM responses.

This project demonstrates responsible AI usage, strict grounding techniques, schema validation, and scalable system design thinking.

---

## Live Demo

🔗 Vercel Deployment URL:  
(Insert your deployed link here)

---

## Overview

Smart Travel Scout allows users to:

- Enter a natural language travel query  
- Filter experiences by minimum and maximum price  
- Select preference tags (e.g., beach, adventure, cultural)  
- Receive AI-generated recommendations  
- View reasoning for why each recommendation matches  

The AI is strictly grounded to a predefined inventory and cannot invent destinations.

---

## Features

- Natural language search
- Price range filtering (Min / Max)
- Tag-based filtering
- AI-generated reasoning
- Deterministic responses (temperature = 0)
- Strict schema validation
- Guardrail filtering to prevent hallucinations
- Graceful error handling
- Clean, user-friendly UI

---

## Architecture Overview

### Frontend
- Next.js (App Router)
- TailwindCSS for styling
- Controlled form inputs
- User-friendly labels for Min Price / Max Price
- Input validation with helpful feedback

### Backend
- `/api/search` route
- OpenAI API integration
- Structured JSON output enforcement
- Zod schema validation
- Inventory ID whitelist filtering
- Graceful error responses

---

## AI & Grounding Strategy

To prevent hallucinations and ensure safety:

1. The full inventory (small dataset) is passed into the prompt.
2. The system prompt clearly instructs the model:
   - Only return IDs from the provided inventory.
   - Never invent new travel packages.
3. The model response must follow a strict JSON structure.
4. Zod validates the schema at the API boundary.
5. A whitelist filter ensures returned IDs exist in local inventory.
6. Temperature is set to `0` for deterministic responses.

This layered defense approach ensures grounded and reliable AI output.

---

#  Passion Check – Engineering Reflection

## 1️. The "Under the Hood" Moment

One specific technical hurdle I faced was ensuring that the AI response strictly returned valid inventory IDs in proper JSON format.

Initially, the model occasionally:
- Wrapped JSON in markdown code blocks  
- Slightly altered field names  
- Returned descriptive text outside the JSON structure  

### How I Debugged It

- Logged the raw AI response before parsing.
- Enforced `temperature: 0` for consistency.
- Strengthened the system prompt with strict return rules.
- Added Zod schema validation to reject malformed responses.
- Implemented a whitelist filter to remove unknown IDs.

This experience reinforced an important lesson:

> Prompt instructions alone are not sufficient — backend validation is essential when working with AI systems.

---

## 2️. The Scalability Thought

If the inventory scaled from 5 packages to 50,000 packages, passing the entire inventory into the prompt would:

- Increase token usage dramatically
- Increase cost
- Increase latency
- Reduce model precision

### Scalable Approach: Hybrid Retrieval

Instead of sending all packages:

### Step 1 — Precompute Embeddings
Generate embeddings for:
- Title
- Description
- Tags
- Location

Store them in a vector database (e.g., pgvector, Pinecone, Supabase Vector).

### Step 2 — Top-K Retrieval
- Convert user query to embedding.
- Retrieve top 5–10 most relevant packages.
- Send only those candidates to the LLM.

### Step 3 — Constrained LLM Output
- Ask the LLM to return only selected IDs with reasoning.
- Enforce strict schema validation.
- Join IDs to local data.

### Cost Controls
- Short system prompts
- Cache identical prompts
- Temperature near 0
- Early return logic if keyword filtering is sufficient
- Possibly use a smaller model for ranking

This architecture reduces cost, improves precision, and ensures scalability.

---

## 3️. The AI Reflection

I used ChatGPT as my primary AI development assistant.

It helped with:
- Structuring the OpenAI API call
- Designing grounding strategies
- Improving prompt clarity
- Refining schema validation
- Strengthening documentation

### A Buggy Suggestion I Encountered

At one point, the AI suggested trusting the model output after simply instructing it to "only return valid IDs."

However, during testing:
- The model occasionally returned malformed JSON.
- It once returned a destination name instead of an ID.

### How I Corrected It

I implemented:
- Zod schema validation
- Manual whitelist filtering
- Defensive error handling

This reinforced that AI is a helpful assistant — but system reliability must be enforced through engineering safeguards.

---

## Safety Measures

- Deterministic output (`temperature: 0`)
- Strict JSON schema validation
- Whitelist filtering of IDs
- Input validation for min/max price
- Validation for selected tags
- Graceful error responses

---

## Local Setup

1. Clone repository




This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
