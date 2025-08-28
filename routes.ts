import React from 'react';

// Import all page components
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ExperiencePage from './pages/ExperiencePage';
import EducationPage from './pages/EducationPage';
import CertificatesPage from './pages/CertificatesPage';
import UseCasesPage from './pages/UseCasesPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import TechStackPage from './pages/TechStackPage';
import OpenSourcePage from './pages/OpenSourcePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import SitemapPage from './pages/SitemapPage';

export interface RouteConfig {
  path: string;
  component: React.FC<any>;
  key: string; // For SEO lookups
}

export const routes: RouteConfig[] = [
  { path: '/', component: HomePage, key: 'home' },
  { path: '/about', component: AboutPage, key: 'about' },
  { path: '/contact', component: ContactPage, key: 'contact' },
  { path: '/experience', component: ExperiencePage, key: 'experience' },
  { path: '/education', component: EducationPage, key: 'education' },
  { path: '/certificates', component: CertificatesPage, key: 'certificates' },
  { path: '/use-cases', component: UseCasesPage, key: 'useCases' },
  { path: '/projects', component: ProjectsPage, key: 'projects' },
  { path: '/projects/:slug', component: ProjectDetailPage, key: 'projectDetail' },
  { path: '/open-source', component: OpenSourcePage, key: 'openSource' },
  { path: '/tech-stack', component: TechStackPage, key: 'techStack' },
  { path: '/blog', component: BlogPage, key: 'blog' },
  { path: '/blog/:slug', component: BlogPostPage, key: 'blogPost' },
  { path: '/sitemap', component: SitemapPage, key: 'sitemap' },
];