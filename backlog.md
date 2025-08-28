# Transformation Backlog: From Web App to Website

This backlog outlines the key epics and stories required to transform the current single-page application (SPA) into a more traditional, performant, and SEO-friendly website.

---

### **Epic 1: Foundational Architecture Overhaul (High Priority)**

*This epic focuses on migrating from the current client-side rendering model to a modern architecture like Static Site Generation (SSG) or Server-Side Rendering (SSR) for improved performance and SEO.*

-   **Story 1.1: Implement Path-Based Routing**
    -   **Description:** Transition from the current hash-based URLs (`/#/about`) to clean, standard URL paths (`/about`) to improve user experience, link sharing, and search engine crawlability.

-   **Story 1.2: Adopt a Static or Server-Rendered Framework**
    -   **Description:** Migrate the React application to a framework like Next.js or Astro to pre-render pages into static HTML, resulting in near-instant load times and perfect indexability for search engines.

---

### **Epic 2: Enterprise-Grade Content Management (Medium Priority)**

*This epic focuses on evolving the JSON-based content system into a true, non-technical friendly Content Management System (CMS).*

-   **Story 2.1: Implement a Headless CMS**
    -   **Description:** Replace local JSON content files with a true headless CMS (e.g., Sanity, Contentful) to decouple content creation from code deployment, allowing for content updates without developer intervention.

-   **Story 2.2: Refine Information Architecture**
    -   **Description:** Evolve the site structure to be more like a professional services or thought leadership website by expanding on key sections and creating dedicated, detailed pages for core topics.

---

### **Epic 3: Advanced SEO & Performance (High Priority)**

*This epic builds on the new architecture to implement best-in-class SEO and performance practices.*

-   **Story 3.1: Automate SEO Artifact Generation**
    -   **Description:** Implement dynamic, build-time generation of `sitemap.xml` and `robots.txt` to ensure they are always perfectly in sync with the site's content.

-   **Story 3.2: Implement Comprehensive Structured Data (Schema.org)**
    -   **Description:** Expand upon the existing JSON-LD implementation by creating detailed, specific schemas for each content type (articles, services, etc.) to improve the chances of rich snippet results in search engines.

---

### **Epic 4: Infrastructure & Deployment (High Priority)**

*This epic covers the necessary changes to the hosting and deployment pipeline to support the new architecture.*

-   **Story 4.1: Transition to Modern Jamstack Hosting**
    -   **Description:** Deploy the new site on a platform optimized for SSG/SSR frameworks, such as Vercel or Netlify, to provide seamless Git integration, automatic builds, and a global CDN for optimal performance.
