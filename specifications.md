# Website Specifications & Developer Guide

This document provides a comprehensive overview of the website's architecture, functionality, and development guidelines. Its purpose is to ensure consistency, maintainability, and a shared understanding of the project's technical details.

## 1. Project Overview

This is a modern, single-page application (SPA) portfolio for Elliot Margot, an AI & Power Platform Consultant. The website is designed to be a professional, aesthetically pleasing, and informative hub showcasing his expertise, experience, and projects. It is fully responsive, multi-lingual, and built with a focus on performance and clean code.

### Core Technologies

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Styling:** Custom CSS with a component-scoped architecture
- **AI Integration:** Google Gemini API
- **Content Management:** Custom React Context with a headless CMS architecture using flat JSON files.
- **Module Loading:** ES Modules with `importmap`

---

## 2. Architecture & File Structure

The application uses a clean, scalable structure that decouples content from the application itself.

- **`index.html`:** The single entry point for the application.
- **`index.tsx`:** Renders the React application into the DOM and wraps it with Providers.
- **`App.tsx`:** The root component. It contains the routing logic, manages SEO for static and dynamic pages, and assembles the main layout.
- **`/components`:** Contains all reusable UI components.
- **`/pages`:** Contains top-level components that represent a full page view (e.g., `HomePage.tsx`, `AboutPage.tsx`).
- **`/i18n`:** Contains all logic and data for internationalization.
  - **`/locales`:** Stores `en.json` and `fr.json` files containing **UI strings only**.
  - **`/content`:** Contains all page-specific content, simulating a headless CMS.
- **`/styles`:** Contains all custom stylesheets, typically one per component.
  - **`global.css`:** Defines root CSS variables (including the color palette), a modern CSS reset, and base element styles.

---

## 3. Core Functionality Deep Dive

### 3.1. Dynamic Content & "Page Builder" Architecture

- **Layout Engine:** The `ProjectDetailLayout.tsx` component acts as a "page builder," dynamically rendering a page's layout based on an array of structured content blocks from a JSON file.
- **Content as Data:** Each project's content is defined by a JSON file in `/i18n/content/projects/`. The content is an array of objects, where each object specifies a `type` (corresponding to a React component) and the `props` for that component. This allows for rich, varied article layouts without changing the page's code.

### 3.2. Gemini API Integration

#### **`GeminiBot.tsx` (ElliotBot Co-Pilot)**
- **Context-Awareness:** Constructs a detailed system prompt by pulling data from the i18n content and is aware of the user's current route to offer proactive assistance.
- **Tool-Use:** Can trigger actions like navigating to pages or filtering the use case library based on conversational commands.
- **Streaming Responses:** Uses `chat.sendMessageStream` for a fluid, real-time user experience.
- **Multimodal Bug Reporting:** Users can attach a screenshot when reporting a bug. The bot sends both the user's text and the image to the Gemini API. The AI analyzes the image, describes it, and includes this description in the generated bug report, providing richer context for debugging.

#### **`AIDinoGame.tsx` (Gemini Rush)**
- **Mechanism:** A live test of the `gemini-2.5-flash` model's instant binary decision-making capabilities.
- **Low-Latency Configuration:** Optimized for speed by disabling thinking (`thinkingConfig: { thinkingBudget: 0 }`).

---

## 4. Style Guide

### 4.1. Color Palette

| Usage                   | CSS Variable                 | Light Mode Hex | Dark Mode Hex |
| ----------------------- | ---------------------------- | -------------- | ------------- |
| Primary Background      | `--primary-background`       | `#FFFFFF`      | `#111827`     |
| Surface Background      | `--surface-background`       | `#F9FAFB`      | `#1F2937`     |
| Border Color            | `--border-color`             | `#E5E7EB`      | `#374151`     |
| Light Border Color      | `--border-color-light`       | `#F3F4F6`      | `#4B5563`     |
| Primary Text/Headings   | `--primary-text`             | `#111827`      | `#F9FAFB`     |
| Secondary Text          | `--secondary-text`           | `#4B5563`      | `#9CA3AF`     |
| Interactive Elements    | `--interactive-blue`         | `#4F46E5`      | `#6366F1`     |
| Interactive Hover       | `--interactive-hover`        | `#4338CA`      | `#818CF8`     |
| Brand Orange            | `--primary-brand-orange`     | `#F26F21`      | `#F97316`     |
| Brand Blue              | `--secondary-brand-blue`     | `#2A3B4E`      | `#38BDF8`     |
| Footer Background       | `--footer-background`        | `#111827`      | `#0D1117`     |
| Footer Text             | `--footer-text`              | `#FFFFFF`      | `#F9FAFB`     |
| Footer Copyright        | `--footer-copyright`         | `#9CA3AF`      | `#6B7280`     |

### 4.2. Typography

#### **Primary Font: Inter**
Used for all body text, UI elements, and general content.

| Element                   | Weight          | Size       |
| ------------------------- | --------------- | ---------- |
| `<h1>` (Main Page Title)  | Bold (700)      | `3.052rem` |
| `<h2>` (Section Titles)   | Bold (700)      | `2.441rem` |
| `<p>`, `<li>`               | Regular (400)   | `1rem`     |

#### **Secondary Font: Lora**
Used for headings (`<h3>`) on project detail pages for an editorial feel.

| Element             | Weight          | Size      |
| ------------------- | --------------- | --------- |
| Project Page `<h3>` | Semi-bold (600) | `2rem`    |
| Project Page `<p>`  | Regular (400)   | `1.125rem`|

### 4.3. Dark Mode
The application features a full dark mode. A theme toggle button is located in the header, allowing users to switch between light and dark themes. The user's preference is saved in `localStorage` and will be applied on subsequent visits. The system also respects the user's operating system preference (`prefers-color-scheme`) for the initial visit.

---

## 5. Component Library (Selected)

A library of reusable components that can be rendered by the "Page Builder" engine.

- **`FaqAccordion.tsx`**
  - **Description:** A clean, modern accordion for displaying Q&A content with smooth open/close animations.
  - **Props:** `items: { question: string; answer: string; }[]`

- **`MythVsFact.tsx`**
  - **Description:** A component for clearly distinguishing between a myth and a fact using distinct color-coding.
  - **Props:** `myth: string`, `fact: string`

- **`ProTip.tsx`**
  - **Description:** A callout box for highlighting professional tips or important advice, featuring a lightbulb icon.
  - **Props:** `content: string`
  
- **`CodeBlock.tsx`**
  - **Description:** A professionally styled component for displaying code snippets with a "macOS-style" window theme and syntax highlighting.
  - **Props:** `code: string`, `language: string`, `theme: 'window' | 'default'`
  
- **`DemoCard.tsx`**
  - **Description:** A prominent, interactive card used to launch interactive demos. Features glowing hover effects and a "Play" button.
  - **Props:** `description: string`, `buttonText: string`, `onClick: () => void`

- **`Card.tsx`**
  - **Description:** A versatile card component with multiple variants (`simple`, `project-overview`, `carousel`) for displaying linked content.
  - **Props:** `variant`, `imageUrl`, `category`, `title`, `description`, `link`, etc.

---

## 6. Development & Maintenance Guidelines

### 6.1. Content Management
- **UI Strings vs. Page Content:** UI strings (e.g., button labels, navigation) go in `/i18n/locales`. All page-specific, authored content goes in `/i18n/content`.
- **Adding a Project:**
  1.  Create a new JSON file in `/i18n/content/projects/` (e.g., `my-new-project.en.json`).
  2.  Author the `content` array using the available component types listed in the `ProjectDetailLayout.tsx` component map.
  3.  Add a corresponding summary object to `i18n/content/projects.en.json`, ensuring the `slug` matches the filename.

### 6.2. Styling
- **Methodology:** Use a component-scoped CSS approach. Each component should have its own stylesheet in the `/styles` directory.
- **Global Styles:** Use `styles/global.css` for root CSS variables, a CSS reset, and base element styles only. Avoid adding component-specific styles here.
- **Naming Convention:** Use a BEM-like naming convention (`block-name__element-name--modifier-name`) for clarity and to avoid style conflicts.