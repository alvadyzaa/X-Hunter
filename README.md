# X-Hunter: The Ultimate AI Twitter Content Strategist 🎯

**X-Hunter** is an advanced, privacy-first AI tool designed to help Twitter/X creators craft viral content, analyze topic saturation, and brainstorm engagement-driven hooks. 

It leverages the power of the **Google Gemini API** through a secure Cloudflare Worker backend, ensuring your API keys are never stored on a centralized database—giving you complete control and privacy.

---

## ✨ Core Features

*   **🕵️‍♂️ Topic & Draft Analysis**: Input a keyword or a rough draft, and X-Hunter will analyze its viral potential, hook strength, emotional impact, and saturation level on Twitter.
*   **🧠 Local Brainstorming (Zero API Cost)**: Instantly generate over 25+ viral hook formulas (in English and Bahasa Indonesia) locally in your browser. Perfect for saving your API quota!
*   **🤖 AI Generation Engine**:
    *   **Viral Hooks**: Generate 5 incredibly compelling, scroll-stopping variations.
    *   **Full Tweets**: Expand ideas into polished, engagement-optimized tweets.
    *   **Threads**: Automatically structure comprehensive 5-part Twitter threads.
    *   **Poll Ideas**: Create debate-sparking poll questions and options.
*   **🎭 Custom AI Personas**: Inject custom prompt instructions (e.g., "Write like Naval Ravikant" or "Gunakan bahasa gaul Jaksel") via the Template Manager in Settings.
*   **🔄 Tone Rewriter**: Instantly rewrite drafts into *Safer*, *Viral*, or *Controversial* tones.
*   **📉 Quota Tracking**: Visual badge to monitor your Gemini API Free Tier limits (15 requests/minute).
*   **💾 Local History & Caching**: All generated analyses are cached in your browser's Local Storage. Searching old topics costs **0 API credits**.
*   **📄 Export to PDF**: Download your analysis reports as beautifully formatted PDF documents.

---

## 🛠️ Technology Stack

X-Hunter is built with modern, serverless web technologies:

**Frontend:**
*   **React 19** & **Vite**: Ultra-fast frontend framework and bundler.
*   **Tailwind CSS**: Utility-first CSS framework for a stunning, responsive UI.
*   **Zustand**: Lightweight and fast global state management (with `localStorage` persistence).
*   **Lucide React**: Beautiful, consistent icon set.
*   **html2pdf.js**: Client-side PDF generation.

**Backend (API Proxy):**
*   **Cloudflare Workers**: Edge computing platform for low-latency, serverless API execution.
*   **Hono**: Extremely fast, lightweight web framework built for Edge runtimes.
*   **Google Gemini API (`gemini-2.0-flash`)**: The core LLM powering the analysis and generation.

---

## 📐 Project Structure

```text
X-Hunter/
├── frontend/             # React + Vite UI Application
│   ├── src/
│   │   ├── api/          # API client calling the Cloudflare Worker
│   │   ├── components/   # Reusable React components (ScoreCard, Modals, etc.)
│   │   ├── pages/        # Main route pages (Dashboard, Analyze/History, Settings, Result)
│   │   └── store/        # Zustand global state (useAnalyzeStore, useToastStore)
│   └── public/           # Static assets (Favicons, Open Graph Images)
│
└── worker/               # Cloudflare Worker Backend (Hono)
    ├── src/
    │   ├── index.ts              # Main Hono entry point & CORS config
    │   ├── routes/
    │   │   ├── analyze.ts        # Route for deep analysis scoring
    │   │   └── generateRoutes.ts # Routes for Hooks, Threads, Polls, Rewrites
    │   └── services/
    │       ├── geminiApi.ts      # Google Gemini REST API integration
    │       └── promptBuilder.ts  # System instructions & Prompt Engineering layer
    └── wrangler.toml             # Cloudflare configuration file
```

---

## 🔒 Privacy & Security First

**X-Hunter does NOT use a centralized database.**
1.  **API Keys**: Your Gemini API key is saved safely in your browser's `localStorage`. It is only transmitted securely in the Request Header directly to the Cloudflare Edge Worker.
2.  **History & Settings**: All your analysis history and custom prompts are stored strictly on your device.
3.  **Proxy Architecture**: The Cloudflare Worker acts as a proxy to communicate with Google Gemini, ensuring your frontend never exposes keys if you choose to hardcode a fallback key in the Worker environment variables.

---

*Built with passion and love to beat the algorithm. Happy Hunting! 🎯*
