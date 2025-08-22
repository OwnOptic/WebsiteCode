# Website Specifications & Developer Guide

This document provides a comprehensive overview of the website's architecture, functionality, and development guidelines. Its purpose is to ensure consistency, maintainability, and a shared understanding of the project's technical details.

## 1. Project Overview

This is a modern, single-page application (SPA) portfolio for Elliot Margot, an AI & Power Platform Consultant. The website is designed to be a professional, aesthetically pleasing, and informative hub showcasing his expertise, experience, and projects. It is fully responsive, multi-lingual, and built with a focus on performance and clean code.

### Core Technologies

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Styling:** TailwindCSS (via CDN) & CSS Variables
- **AI Integration:** Google Gemini API
- **Content Management:** Custom React Context with a headless CMS architecture
- **Module Loading:** ES Modules with `importmap`

---

## 2. Architecture & File Structure

The application uses a clean, scalable structure that decouples content from the application itself.

- **`index.html`:** The single entry point for the application.
- **`index.tsx`:** Renders the React application into the DOM.
- **`App.tsx`:** The root component. It contains the routing logic, manages SEO for static and dynamic pages, and assembles the main layout.
- **`analytics.ts`:** A wrapper for Google Analytics `gtag` calls, providing a consistent API for tracking page views and custom events.
- **`/components`:** Contains all reusable UI components.
  - **`GeminiBot.tsx`:** A context-aware chatbot powered by the Gemini API with advanced tool-use capabilities.
  - **`UseCaseCatalogue.tsx`:** The interactive library of use cases.
  - **`UseCaseDetail.tsx`:** The modal component for displaying detailed use case information, which can include interactive demos.
  - **`InvoiceDemo.tsx`:** An example of a live, interactive demo that calls the Gemini API to perform multimodal data extraction.
  - **`/icons`:** Contains reusable SVG icons as React components, including `BrandLogo.tsx`.
- **`/pages`:** Contains top-level components that represent a full page view.
  - **`ProjectDetailPage.tsx`:** A dynamic page that renders a single, detailed project case study based on a URL slug.
- **`/i18n`:** Contains all logic and data for internationalization.
  - **`/locales`:** Stores `en.json` and `fr.json` files containing **UI strings only** (e.g., navigation, button text, static labels).
  - **`/content`:** Contains all page-specific content, simulating a headless CMS.
      - **`/projects`:** Contains individual JSON files for each detailed project case study.
      - **`/use-cases`:** Contains JSON files for each industry's use cases.
      - **`about.en.json`, `blog.en.json`, etc.:** Root content files for each section.

---

## 3. Core Functionality Deep Dive

### 3.1. Routing & SEO

- **Mechanism:** The app uses a hash-based routing system managed in `App.tsx`. The routing logic is specifically designed to handle single-page application behavior correctly, ignoring sub-hashes (e.g., `#uc21`) when determining the primary page to render.
- **Deep-linking & Filtering:** The system supports deep-linking with sub-hashes to open specific content (like a use case modal) and URL query parameters (e.g., `.../#/use-cases?industry=Insurance`) to control component state, such as the filters in the Use Case Catalogue.
- **Dynamic Routes:** The system supports dynamic routes for blog posts (`/#/blog/:slug`) and project case studies (`/#/projects/:slug`). The router extracts the `slug` parameter and passes it to the appropriate page component. All project links across the site, including on the homepage and the main projects page, are now fully integrated with the dynamic routing system.
- **Dynamic SEO Management:** An effect hook in `App.tsx` dynamically updates the document's `title` and `meta description` on every route change. For static routes, it uses metadata from the i18n files. For dynamic routes, it finds the specific content (e.g., a blog post or project) and uses its title and summary for the SEO metadata, ensuring every page is individually indexable by search engines.

### 3.2. Headless CMS Architecture (i18n)

- **Mechanism:** The i18n system (`I18nProvider`) acts as a powerful content aggregator that simulates a headless CMS.
- **Functionality:**
  - On language change, `I18nProvider` fetches and merges multiple JSON files: the core UI strings, all primary page content files, and all use case files. This architecture **completely decouples content from the application code**, making content updates safe and simple.
- **`useI18n` Hook:** The `t(key)` function works seamlessly with the merged object, allowing components to access any piece of content or UI string with a single, consistent API.

### 3.3. Gemini API Integration

The application leverages the Google Gemini API for two key features, demonstrating advanced AI capabilities.

#### **`GeminiBot.tsx` (EllioBot Co-Pilot)**
A floating chatbot that acts as an AI guide and co-pilot for the portfolio.

- **Context-Awareness:** On initialization, it constructs a detailed system prompt by pulling data directly from the loaded i18n content (about, experience, skills). This makes the bot highly knowledgeable about the site's content.
- **Streaming Responses:** The bot uses the `chat.sendMessageStream` method to provide real-time, token-by-token responses, creating a fluid and engaging "typing" effect for the user.
- **Tool-Use ("Co-Pilot" Functionality):** The bot is engineered to perform actions.
    - **Mechanism:** The system prompt defines a set of "tools" (`navigateTo`, `filterUseCases`) and instructs the Gemini model to respond with a specific JSON object when it determines a tool should be used.
    - **Execution:** The frontend code in `GeminiBot.tsx` parses the final streamed message. If it's a valid JSON tool call, it executes the corresponding function (e.g., setting `window.location.hash`) and provides a confirmation message to the user.

#### **`InvoiceDemo.tsx` (Interactive Demo)**
A live demonstration within the Use Case library that showcases Gemini's multimodal and data extraction capabilities.

- **Multimodal Input:** It sends both an image (a sample invoice) and a text prompt to the Gemini API in a single `generateContent` request.
- **Structured Output:** It uses the `responseSchema` feature to instruct the model to return a structured JSON object containing the extracted invoice data. This provides a compelling, real-time example of AI's data extraction capabilities.

### 3.4. Analytics

- **Mechanism:** A simple, centralized analytics service is defined in `analytics.ts`. It acts as a wrapper for Google Analytics `gtag.js` calls.
- **Functions:**
  - `init()`: Called once when the app starts.
  - `trackPageView(path, title)`: Called from `App.tsx` on every route change to track page views for SPA navigation.
  - `trackEvent(name, params)`: Called from various components to track specific user interactions, such as opening the chatbot, viewing a use case, or filtering the catalogue.

### 3.5. SEO & Discoverability

- **Sitemap:** A `sitemap.xml` file is included in the project root. Its purpose is to inform search engine crawlers of all available URLs on the site, including static pages and dynamic blog post routes, to ensure proper indexing.
- **Note:** The `sitemap.xml` file in the repository contains placeholder URLs and **must** be updated with the final production domain during deployment (see Production Deployment Guide below).

---

## 4. Development & Maintenance Guidelines

### 4.1. Content Management

- **UI Strings vs. Page Content:**
  - **UI Strings** (reusable text, navigation, labels) go in `/i18n/locales`.
  - **Page Content** (timelines, project details, use cases, page-specific text) go in the `/i18n/content` directory.

- **Adding a New Page:**
  1.  Create the page component in `/pages`.
  2.  Add a new content object for the page in a new file (e.g., `i18n/content/newpage.en.json`).
  3.  Update `i18n/I18nContext.tsx` to fetch and merge the new content file.
  4.  Add SEO metadata for the new page in the `/i18n/locales` files.
  5.  Add the new route to `staticRoutes` in `App.tsx`.
  6.  Add links in `Header.tsx` and `Footer.tsx`.

- **Featuring Content on the Homepage:**
  - The 'Featured Work' section on the homepage is managed in `/i18n/content/home.en.json` and `home.fr.json` under the `homePage.projects` key. This section can feature a mix of projects, articles, or key use cases. To feature an item, add a new object to the `items` array with `imgSrc`, `title`, `description`, and a `link` pointing to the canonical URL (e.g., `#/projects/my-project-slug`).

- **Adding a Blog Post:**
  1.  Add a new JSON object to the `posts` array inside the `blog` content file (e.g., `/i18n/content/blog.en.json`).
  2.  Ensure the `slug` is unique and URL-friendly. No other code changes are needed.

- **Adding a Project Case Study:**
  1.  Create new content files for each language in the `/i18n/content/projects/` directory (e.g., `my-new-project.en.json`).
  2.  The file must follow the established JSON schema: `title`, `subtitle`, `heroImageUrl`, an `overview` object, and an array of `contentSections`.
  3.  **Image Sourcing:** Images for `heroImageUrl` and within the `htmlContent` should be sourced from the asset list in `data/portfolioData.txt`. When embedding images within `htmlContent`, use a standard `<img>` tag and add `class="my-8 rounded-lg shadow-md"` for consistent styling. For example: `<img src="https://path/to/image.png" alt="Descriptive text" class="my-8 rounded-lg shadow-md">`.
  4.  Add a corresponding summary object to the `items` array in the main `/i18n/content/projects.en.json` file. This object must include the `slug`, which must match the filename without the language and extension.
  5.  The application's dynamic routing and content loading system will automatically generate the new page. No code changes in React components are required.

### 4.2. Branding & UI

- **Logo:** The official brand logo is implemented in `components/icons/BrandLogo.tsx`. Use this component wherever the brand mark is needed to ensure consistency.
- **Styling:** Adhere to the color and typography variables defined in `:root` in `index.html`. New components should leverage TailwindCSS classes and these CSS variables.

---

## 5. Production Deployment Guide

This checklist should be followed when preparing the application for a production environment.

### 5.1. Finalize SEO & Analytics
- **[CRITICAL] Update Sitemap:** Open `sitemap.xml` and replace all instances of the placeholder URL (`https://www.example.com`) with the final production domain (`https://www.e-margot.ch`).
- **[CRITICAL] Update Google Analytics ID:** In `index.html` and `analytics.ts`, replace the placeholder `G-XXXXXXXXXX` with the actual Google Analytics Measurement ID for the production domain.

### 5.2. Submit Sitemap to Search Engines
Once your site is live at its final domain, you should submit your sitemap to Google to ensure all pages are indexed correctly and to monitor your site's performance in search results.

1.  **Access Google Search Console:** Log in to [Google Search Console](https://search.google.com/search-console) with your Google account.
2.  **Add Your Property:** If you haven't already, add your website's domain (`https://www.e-margot.ch`) as a new property and follow the steps to verify ownership.
3.  **Navigate to Sitemaps:** In the left-hand menu, under the "Indexing" section, click on "Sitemaps".
4.  **Submit the Sitemap:** In the "Add a new sitemap" section, enter the path to your sitemap file: `sitemap.xml`. The full URL should be `https://www.e-margot.ch/sitemap.xml`.
5.  **Click Submit:** Google will now periodically crawl and index the URLs listed in your sitemap. You can return to this section to check the status and see if any issues are discovered.

### 5.3. Configure Environment
- **[CRITICAL] Set Gemini API Key:** The application requires the `process.env.API_KEY` environment variable to be set in the production hosting environment. This is essential for all AI features to function.

### 5.4. Pre-flight Checks
- **Functionality:** Perform a full regression test of all key features: routing, language switching, chatbot interactions (including tool-use), and the use case catalogue.
- **Cross-Browser Compatibility:** Test the application on the latest versions of major browsers (Chrome, Firefox, Safari, Edge).
- **Responsiveness:** Verify that the layout is correct across a range of device sizes, from mobile to desktop.
- **Performance:** Run a performance audit (e.g., using Lighthouse) to check for any major issues with loading speed or runtime performance.

---

## 6. Known Issues & Technical Debt

This section documents known bugs or areas of technical debt that are slated for future improvement.

### 6.1. Navigation Bug from Project Detail Page

- **Status:** **Resolved**. Tracked in `backlog.md` as EPIC 43.
- **Description:** A critical bug was identified where navigating from a project detail page (e.g., `/#/projects/ai-ethics-insurance`) back to the main projects listing page (`/#/projects`) caused a fatal JavaScript error: `Uncaught TypeError: posts.forEach is not a function`.
- **Root Cause Analysis & Fix:** The error was traced to the `t()` function in `I18nContext.tsx`. When a nested translation key (e.g., `blog.posts`) was not found, the function would incorrectly return the key itself as a string. Components expecting an array and using a fallback (e.g., `t('blog.posts') || []`) would then receive the string `"blog.posts"` instead of an empty array, causing a crash when an array method like `.forEach()` was called. The issue was resolved by modifying the `t()` function to return `undefined` on failure. This ensures that the `|| []` fallback now works as intended, making the entire content-loading system more robust against missing translation keys.