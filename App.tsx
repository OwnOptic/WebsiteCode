import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ExperiencePage from './pages/ExperiencePage';
import EducationPage from './pages/EducationPage';
import CertificatesPage from './pages/CertificatesPage';
import UseCasesPage from './pages/UseCasesPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import TechStackPage from './pages/TechStackPage';
import GeminiBot from './components/GeminiBot';
import { useI18n } from './i18n/useI18n';
import * as analytics from './analytics';

const staticRoutes: { [key: string]: { component: React.ReactNode; key: string } } = {
    '#/': { component: <HomePage />, key: 'home' },
    '#/about': { component: <AboutPage />, key: 'about' },
    '#/experience': { component: <ExperiencePage />, key: 'experience' },
    '#/education': { component: <EducationPage />, key: 'education' },
    '#/certificates': { component: <CertificatesPage />, key: 'certificates' },
    '#/use-cases': { component: <UseCasesPage />, key: 'useCases' },
    '#/blog': { component: <BlogPage />, key: 'blog' },
    '#/projects': { component: <ProjectsPage />, key: 'projects' },
    '#/tech-stack': { component: <TechStackPage />, key: 'techStack' },
    '#/contact': { component: <ContactPage />, key: 'contact' },
};

const App: React.FC = () => {
    const { t } = useI18n();
    const getRoute = () => {
        const hash = window.location.hash || '#/';
        const match = hash.match(/^#\/[^#]*/);
        return match ? match[0] : '#/';
    };
    const [route, setRoute] = useState(getRoute());

    useEffect(() => {
        analytics.init();
    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            setRoute(getRoute());
            window.scrollTo(0, 0);
        };
        
        window.addEventListener('hashchange', handleHashChange);
        
        let title, description;
        const routeKey = route.split('#/')[1]?.split('?')[0] || '';

        if (route.startsWith('#/blog/')) {
            const slug = route.substring('#/blog/'.length);
            const posts = t('blog.posts') || [];
            const post = posts.find((p: any) => p.slug === slug);
            if (post) {
                title = `${post.title} | Elliot Margot`;
                description = post.summary;
            } else {
                title = 'Blog Post Not Found | Elliot Margot';
                description = 'The requested blog post could not be found.';
            }
        } else if (route.startsWith('#/projects/')) {
            const slug = route.substring('#/projects/'.length);
            const projectDetails = t('projects.details') || {};
            const project = projectDetails[slug];
             if (project) {
                title = `${project.title} | Elliot Margot`;
                description = project.subtitle;
            } else {
                title = 'Project Not Found | Elliot Margot';
                description = 'The requested project could not be found.';
            }
        } else {
            const currentHash = `#/` + (routeKey ? `${routeKey}` : '');
            const routeInfo = staticRoutes[currentHash] || staticRoutes['#/'];
            const seoKey = `seo.${routeInfo.key}`;
            title = t(`${seoKey}.title`);
            description = t(`${seoKey}.description`);
        }

        if (title) {
            document.title = title;
            analytics.trackPageView(route, title);
        }

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && description) {
            metaDescription.setAttribute('content', description);
        }

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [route, t]);
    
    const renderPage = () => {
        if (route.startsWith('#/blog/')) {
            const slug = route.substring('#/blog/'.length);
            return <BlogPostPage slug={slug} />;
        }
        if (route.startsWith('#/projects/')) {
            const slug = route.substring('#/projects/'.length);
            return <ProjectDetailPage slug={slug} />;
        }
        return (staticRoutes[route] || staticRoutes['#/']).component;
    };

    return (
        <div className="bg-[var(--primary-background)] text-[var(--primary-text)] antialiased flex flex-col min-h-screen">
            <Header currentRoute={route} />
            <main className="flex-grow">
                {renderPage()}
            </main>
            <Footer />
            <GeminiBot />
        </div>
    );
};

export default App;
