# Website Feature Backlog

This document outlines the future development epics for the website, focusing on enhancing its capabilities as a professional platform for thought leadership, interactive experiences, and long-term scalability. The backlog has been optimized and prioritized to address critical fixes first, followed by high-impact enhancements.

### Active & Upcoming Epics (Prioritized)

- **EPIC 44: UI/UX Refinements** [HIGH PRIORITY]
    - **Description:** A series of targeted improvements to enhance the visual appeal and user experience of key pages.
    - **USER STORY 44.4: Fix Header Text Color Inversion:** [CRITICAL FIX]
        - **Task:** Correct the CSS logic in the `Header.tsx` component. When the header background becomes opaque (either by scrolling down or navigating away from the homepage), the navigation link text color must invert from white to `var(--primary-text)` to ensure readability against the light background.
    - **USER STORY 44.1: Improve Layout for Content Pages:**
        - **Task:** Remove the "On this page" sidebar from the project detail pages (`ProjectDetailLayout.tsx`). This will create a more focused, single-column reading experience which is better suited for long-form case study content.
    - **USER STORY 44.2: Enhance Visuals on Card Components:**
        - **Task:** Increase the height of the main images on all card components (`HomeProjects.tsx`, `Projects.tsx`, `BlogList.tsx`, `BlogPost.tsx`) to give them more visual weight and make the pages more engaging.
    - **USER STORY 44.3: Refine Project Overview Card:**
        - **Task:** To improve data privacy and visual clarity, remove the "Client" field from the `ProjectDetailLayout.tsx` overview card. Adjust the card's layout from a two-column grid to a single-column list to ensure a balanced and aesthetically pleasing presentation with the remaining items (Industry, Timeline, Tech Stack).

- **EPIC 45: Project Showcase Overhaul** [HIGH PRIORITY]
    - **Description:** A comprehensive visual and content redesign of the project detail pages to create a more immersive, engaging, and professional case study experience.
    - **USER STORY 45.1: Redesign Project Detail Layout:**
        - **Task:** Re-architect the `ProjectDetailLayout.tsx` to a more sophisticated, spacious layout. Improve typography and whitespace to enhance readability. A new "sticky" sidebar should be introduced to keep the "Project Overview" card visible as the user scrolls, providing persistent context.
    - **USER STORY 45.2: Rewrite Case Study Content:**
        - **Task:** Rewrite the content within the project detail JSON files (`ai-ethics-insurance` and `ai-hackathon-google`) to follow a more compelling narrative structure. Focus on storytelling—clearly outlining the challenge, the process/solution, and the outcome/results to create a stronger impact.
    - **USER STORY 45.3: Integrate More Visuals:**
        - **Task:** Strategically select and embed additional, relevant images from the `data/portfolioData.txt` asset library directly into the `htmlContent` of the project case studies. This will break up long text blocks, provide visual context, and make the pages more dynamic and aesthetically pleasing.

- **EPIC 46: Chatbot Enhancement** [MEDIUM PRIORITY]
    - **Description:** A series of improvements to enhance the chatbot's personality and functionality.
    - **USER STORY 46.1: Rebrand to ElliotBot:**
        - **Task:** Change all user-facing instances of "EllioBot" to "ElliotBot" to align with the desired branding.
    - **USER STORY 46.2: Enhance Response Formatting:**
        - **Task:** Update the chatbot's system prompt to instruct it to use basic HTML for formatting (like bolding and lists) and to incorporate relevant emojis to create a more engaging and expressive user experience.

- **EPIC 47: Content & Data Accuracy** [MEDIUM PRIORITY]
    - **Description:** Ensure all project content and imagery is accurate and up-to-date.
    - **USER STORY 47.1: Correct Project Technologies:**
        - **Task:** Update the content for the "AI Hackathon" project to accurately reflect the use of Vertex AI and Google Cloud Platform, removing the incorrect reference to Copilot Studio.
    - **USER STORY 47.2: Overhaul Projects Page Imagery:**
        - **Task:** Conduct a full review of the main Projects page. Verify all project card images are loading correctly and are sourced from the approved asset list in `data/portfolioData.txt`. Replace any broken or placeholder images.

- **EPIC 39: Blog Refactor to External Feed** [MEDIUM PRIORITY]
    - **USER STORY 39.1:** Refactor the blog to link externally. Update the blog list component so that the "Read Article" links for the "AI Onboarding Assistant" and "Ultimate AI Assistant" posts point directly to their respective LinkedIn URLs.
    - **USER STORY 39.2:** Remove individual blog pages. Delete the `BlogPostPage.tsx` component and the associated content files for the blog posts, as they will no longer be hosted directly on the site.

- **EPIC 48: UI/UX Enhancements II** [LOW PRIORITY]
    - **Description:** Further UI improvements to enhance navigation and site structure.
    - **USER STORY 48.1: Implement Breadcrumb Navigation:**
        - **Task:** Design and implement a breadcrumb navigation component. This component should appear on nested pages (e.g., Blog Posts, Project Details) to provide users with clear context of their location within the site hierarchy and allow for easy navigation back to parent pages.

- **EPIC 32: Advanced SEO & Indexing Architecture** [LOW PRIORITY]
    - **USER STORY 32.1:** Implement a pre-rendering or Server-Side Rendering (SSR) strategy. Investigate and implement a solution to serve fully-rendered HTML pages to search engine crawlers. This will guarantee optimal indexing of all content, including dynamic pages like blog posts and use cases, moving beyond the current client-side JavaScript-dependent approach.

- **EPIC 33: Development Governance & Best Practices** [LOW PRIORITY]
    - **USER STORY 33.1:** Enforce HTML-only content generation. All new content (blogs, use cases) must be written using HTML tags within the JSON files, not Markdown, to ensure consistent and predictable rendering without a client-side parsing library.
