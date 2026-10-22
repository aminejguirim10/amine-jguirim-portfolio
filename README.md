<div align="center">

# ✦ Amine Jguirim — Portfolio

### Agentic AI Engineering · Full-Stack · DevOps

Personal portfolio showcasing my projects, background, certifications, and technical expertise, with an AI assistant that answers questions about my work.

<p>
  <img src="https://img.shields.io/badge/Next.js-16.4.1-000000?logo=next.js&logoColor=white" alt="Next.js 16">
  <img src="https://img.shields.io/badge/React-19.3.0-61DAFB?logo=react&logoColor=111827" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4">
  <img src="https://img.shields.io/badge/AI_SDK-7-000000?logo=vercel&logoColor=white" alt="AI SDK">
</p>

<p>
  <a href="#-features">✨ Features</a> ·
  <a href="#-featured-projects">🚀 Projects</a> ·
  <a href="#-quick-start">⚡ Quick start</a> ·
  <a href="#-technology-stack">🧰 Stack</a>
</p>

<p>
  <a href="https://github.com/aminejguirim10">GitHub</a> ·
  <a href="https://www.linkedin.com/in/mohamed-amine-jguirim/">LinkedIn</a>
</p>

</div>

---

## 🎯 About

This portfolio is a personal web experience designed to showcase my work as a computer engineering student focused on **agentic AI**, **full-stack development**, and **DevOps**.

More than a static showcase, it enables visitors to:

- explore detailed project case studies;
- review my academic and professional background;
- discover my certifications and technical skills;
- download my resume;
- ask an AI assistant questions about my experience, projects, and technology stack;
- view public statistics from my GitHub profile.

## ✨ Features

|     | Feature                    | Description                                                                       |
| :-: | -------------------------- | --------------------------------------------------------------------------------- |
| 🏠  | **Editorial homepage**     | Introduction to my profile, professional focus, and areas of expertise.           |
| 🚀  | **Project index**          | Project listing with status, year, role, technology stack, and useful links.      |
| 📖  | **Detailed project pages** | Use cases, architecture, key achievements, and technical context.                 |
| 🤖  | **AI assistant**           | Context-aware chat for questions about the portfolio and my background.           |
| ⚡  | **Streaming responses**    | AI-generated responses are displayed progressively in real time.                  |
| 🔁  | **Multi-model fallback**   | Automatic fallback between Google Gemini, Groq, and OpenRouter.                   |
| 🧰  | **Tool calling**           | Controlled actions such as downloading the resume or preparing a contact request. |
|  ⌘  | **Command palette**        | Fast keyboard navigation across the main portfolio sections.                      |
| 🌗  | **Light and dark themes**  | Persistent theme preference with system preference support.                       |
| 📱  | **Responsive interface**   | Optimized for mobile, tablet, and desktop screens.                                |
| 🏅  | **Certifications**         | Showcase of Cisco Networking Academy and AWS credentials.                         |
| 🐙  | **GitHub data**            | Retrieves the number of public repositories from the GitHub API.                  |
| 🔍  | **SEO-ready**              | Metadata, Open Graph, sitemap, and robots configuration with Next.js.             |

## 🚀 Featured projects

The portfolio currently showcases projects including:

- **Agent Studio** — multi-agent software engineering platform orchestrated with LangGraph and Gemini;
- **Folio** — document research assistant based on RAG and hybrid search;
- **Intelligent Support Platform** — microservice-based customer support solution using Java, Angular, and AI;
- **Forge UI Lab** — frontend interface laboratory and experimentation space;
- **Career Suite** — digital tools for career management;
- **Task Flow** — task management and tracking application;
- **J-Chat** — conversational application integrating language models;
- **Next Backup** — data backup and management tool;
- **Internship Blog** and **Audit Management** — additional web and business applications.

Each project page can include its context, use case, technical highlights, GitHub repository, and live demo.

## 🧰 Technology stack

| Area          | Technologies                                    |
| ------------- | ----------------------------------------------- |
| Framework     | Next.js 16, React 19, TypeScript                |
| UI            | Tailwind CSS 4, Radix UI, Lucide React          |
| Animations    | Motion                                          |
| AI            | Vercel AI SDK, Google Gemini, Groq, OpenRouter  |
| Validation    | Zod                                             |
| Navigation    | Command menu with cmdk, keyboard navigation     |
| External data | GitHub API                                      |
| Typography    | Archivo and Instrument Sans through `next/font` |
| Quality       | ESLint, TypeScript, Next.js production build    |
| Deployment    | Compatible with Vercel and Node.js environments |

## 🏗️ Architecture

```text
┌────────────────────────────────────────────────────────────┐
│                    Next.js App Router                      │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ Homepage     │  │ Project pages│  │ Global layout   │  │
│  │ sections     │  │ /projects/id │  │ theme + SEO     │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘  │
│         │                 │                   │           │
│  ┌──────▼─────────────────▼───────────────────▼───────┐   │
│  │ Reusable components and typed content              │   │
│  │ hero · background · projects · certifications ·    │   │
│  │ stack                                               │   │
│  └──────────────────────┬─────────────────────────────┘   │
│                         │                                 │
│  ┌──────────────────────▼─────────────────────────────┐   │
│  │ /api/chat — streaming AI assistant                 │   │
│  │ Gemini → Groq → OpenRouter                          │   │
│  └──────────────────────┬─────────────────────────────┘   │
│                         │                                 │
│              ┌──────────▼──────────┐                      │
│              │ GitHub API / PDF CV │                      │
│              └─────────────────────┘                      │
└────────────────────────────────────────────────────────────┘
```

Portfolio content is centralized in `lib/`, while reusable UI components are organized in `components/`. This separation makes it possible to update the portfolio content without duplicating presentation logic.

## ⚡ Quick start

### Prerequisites

- Node.js 20 or later;
- npm;
- at least one provider API key to enable the AI assistant;
- an optional GitHub token for higher GitHub API rate limits.

### Installation

```powershell
git clone https://github.com/aminejguirim10/amine-jguirim-portfolio.git
cd amine-jguirim-portfolio
npm ci
```

Create a `.env.local` file at the project root:

```dotenv
# At least one provider key is required for the AI assistant.
GOOGLE_GENERATIVE_AI_API_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=

# Optional provider model configuration.
GEMINI_MODEL=gemini-3.5-flash
GROQ_MODEL=openai/gpt-oss-120b
GROQ_FALLBACK_MODEL=qwen/qwen3.8-27b
OPENROUTER_MODEL=nvidia/nemotron-3-ultra-550b-a55b:free
OPENROUTER_FALLBACK_MODEL=nvidia/nemotron-3-super-120b-a12b:free
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Start the development server:

```powershell
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

> Without an AI provider key, the portfolio remains accessible, but the assistant cannot generate responses.

## 📜 Available scripts

```powershell
npm run dev      # Start the development server
npm run lint     # Run ESLint
npm run build    # Build the application for production
npm run start    # Start the production server
```

Before deploying, run:

```powershell
npm run lint
npm run build
```

## 📁 Project structure

```text
por/
├── app/
│   ├── api/chat/route.ts       # AI assistant route
│   ├── projets/[slug]/page.tsx # Dynamic project page
│   ├── globals.css             # Global styles and theme
│   ├── layout.tsx              # Layout, fonts, and metadata
│   └── page.tsx                # Main portfolio page
├── components/
│   ├── ask-ai/                 # AI assistant UI and state
│   ├── ui/                     # Reusable UI components
│   └── *.tsx                   # Portfolio sections
├── lib/
│   ├── ai/                     # Models, fallback, and streaming
│   ├── projects.ts             # Project content and details
│   ├── parcours.ts             # Experience and education
│   ├── certifications.ts       # Certifications and badges
│   ├── github.ts               # GitHub statistics
│   └── site.ts                 # Identity, links, and navigation
├── public/cv.pdf               # Downloadable resume
├── next.config.ts              # Next.js configuration
└── package.json                # Scripts and dependencies
```

## 🌐 Deployment

The project can be deployed to **Vercel**:

1. Import the GitHub repository into Vercel.
2. Configure the AI provider environment variables.
3. Set `NEXT_PUBLIC_SITE_URL` to the public portfolio URL.
4. Deploy the application.

Keep all secrets in environment variables and never commit them to the repository.

## 📬 Contact

- **Email:** mohamedamine.jguirim@enicar.ucar.tn
- **Portfolio:** [aminejguirim.dev]([https://aminejguirim.dev](https://amine-jguirim-portfolio.vercel.app/)
- **GitHub:** [@aminejguirim10](https://github.com/aminejguirim10)
- **LinkedIn:** [Mohamed Amine Jguirim](https://www.linkedin.com/in/mohamed-amine-jguirim/)

---

<div align="center">

Built with Next.js, TypeScript, and a strong focus on user experience.

</div>
