import React, { useState, useEffect } from 'react';
import type { BreadcrumbLink } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import GeminiBot from './components/GeminiBot';
import { useI18n } from './i18n/useI18n';
import * as analytics from './analytics';
import { routes, RouteConfig } from './routes';
import NotFoundPage from './pages/NotFoundPage'; // Import the new 404 page
import './styles/App.css';

const matchRoute = (path: string, routeConfigs: RouteConfig[]): { route: RouteConfig; params: { [key: string]: string } } | null => {
    for (const route of routeConfigs) {
        const paramNames: string[] = [];
        const regexPath = route.path.replace(/:([^\s/]+)/g, (match, paramName) => {
            paramNames.push(paramName);
            return '([^\\s/]+)';
        });

        const regex = new RegExp(`^${regexPath}$`);
        const match = path.match(regex);

        if (match) {
            const params = paramNames.reduce((acc, paramName, index) => {
                acc[paramName] = match[index + 1];
                return acc;
            }, {} as { [key: string]: string });
            return { route, params };
        }
    }
    return null;
};


const generateBreadcrumbs = (route: string, t: (key: string) => any): BreadcrumbLink[] => {
    const toCamelCase = (str: string): string => str.replace(/-([a-z])/g, g => g[1].toUpperCase());
    const basePath = (route.split('?')[0] || '').split('#uc')[0];
    const path = basePath.replace(/^#\//, '');

    if (!path) {
        return []; // No breadcrumbs on the homepage
    }

    const parts = path.split('/');
    const crumbs: BreadcrumbLink[] = [{ label: t('nav.home'), href: '#/' }];
    
    const pageKey = toCamelCase(parts[0]);
    const aboutPages = ['about', 'experience', 'education', 'certificates'];
    const aboutPageKeys = ['about', 'experience', 'education', 'certificates'];


    if (aboutPages.includes(parts[0])) {
        crumbs.push({ label: t('nav.about'), href: '#/about' });
        if (parts[0] !== 'about') {
             const navKey = aboutPageKeys.find(key => key === parts[0]);
             if(navKey) {
                crumbs.push({ label: t(`nav.${navKey}`) });
             }
        }
    } else if (parts[0] === 'projects') {
        crumbs.push({ label: t('nav.projects'), href: '#/projects' });
        if (parts[1]) {
            // Title for project pages is now handled by the page component itself
            // through data fetching, so we don't need to look it up here.
            // A placeholder could be used, but it's better to let the page set its own title.
            // The breadcrumb will be updated by the ProjectDetailPage component.
        }
    } else {
        const navLabel = t(`nav.${pageKey}`);
        if (navLabel) {
            crumbs.push({ label: navLabel });
        }
    }
    
    return crumbs.length > 1 ? crumbs : [];
};

const generateStructuredData = (route: string, t: (key: string) => any) => {
    const baseUrl = 'https://www.e-margot.ch/';
    const author = {
        '@type': 'Person',
        'name': 'Elliot Margot',
        'url': baseUrl
    };

    const path = route.replace(/^#/, '');
    const matchedRoute = matchRoute(path, routes);

    if(!matchedRoute) {
        return {};
    }

    const { route: routeInfo } = matchedRoute;
    const seoKey = `seo.${routeInfo.key}`;

    if (routeInfo.key === 'home') {
        return {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'url': baseUrl,
            'name': t(`${seoKey}.title`),
            'description': t(`${seoKey}.description`),
            'author': author
        };
    }

    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'url': `${baseUrl}${route}`,
        'name': t(`${seoKey}.title`),
        'description': t(`${seoKey}.description`)
    };
};


const App: React.FC = () => {
    const { t } = useI18n();
    const getRoute = () => {
        const hash = window.location.hash || '#/';
        return hash;
    };
    const [route, setRoute] = useState(getRoute());
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbLink[]>([]);
    const [isBotOpen, setIsBotOpen] = useState(false);
    const [botIntent, setBotIntent] = useState<'default' | 'bug_report'>('default');
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(savedTheme);
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        analytics.trackEvent('theme_switch', { theme: newTheme });
    };

    const handleOpenBot = (intent: 'default' | 'bug_report' = 'default') => {
        setBotIntent(intent);
        setIsBotOpen(true);
    };


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
        const baseUrl = 'https://www.e-margot.ch/';
        const defaultImageUrl = 'https://res.cloudinary.com/dapoc7ekn/image/upload/v1756109046/Gemini_Generated_Image_5at9q35at9q35at9_sklnd1.png';
        const currentPath = route.replace(/^#/, '').split('?')[0] || '/';
        const matchedRoute = matchRoute(currentPath, routes);
        
        // SEO for dynamic pages is handled within their respective components
        if (!currentPath.startsWith('/projects/') && !currentPath.startsWith('/blog/')) {
            if (matchedRoute) {
                const seoKey = `seo.${matchedRoute.route.key}`;
                title = t(`${seoKey}.title`);
                description = t(`${seoKey}.description`);
            } else {
                // Handle 404 page SEO
                const seoKey = `seo.notFound`;
                title = t(`${seoKey}.title`);
                description = t(`${seoKey}.description`);
            }
            if (title) {
                document.title = title;
                analytics.trackPageView(route, title);

                // Update Meta Tags
                document.querySelector('meta[name="description"]')?.setAttribute('content', description || '');
                document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
                document.querySelector('meta[property="og:description"]')?.setAttribute('content', description || '');
                document.querySelector('meta[property="og:url"]')?.setAttribute('content', `${baseUrl}${route}`);
                document.querySelector('meta[property="og:image"]')?.setAttribute('content', defaultImageUrl);
                document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
                document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description || '');
                document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', defaultImageUrl);
            }
        }
        
        setBreadcrumbs(generateBreadcrumbs(window.location.hash, t));
        
        const structuredData = generateStructuredData(route, t);
        let scriptTag = document.getElementById('structured-data') as HTMLScriptElement | null;
        if (!scriptTag) {
            scriptTag = document.createElement('script');
            scriptTag.id = 'structured-data';
            document.head.appendChild(scriptTag);
        }
        scriptTag.type = 'application/ld+json';
        if (Object.keys(structuredData).length > 0) {
            scriptTag.textContent = JSON.stringify(structuredData);
        }


        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [route, t]);
    
    const renderPage = () => {
        const pageProps = { breadcrumbs };
        const currentPath = route.replace(/^#/, '').split('?')[0] || '/';
        
        const matchedRoute = matchRoute(currentPath, routes);

        if (matchedRoute) {
            const PageComponent = matchedRoute.route.component;
            return <PageComponent {...pageProps} {...matchedRoute.params} />;
        }
        
        // Fallback to 404 page
        // FIX: The NotFoundPage component does not accept any props, but was being passed 'pageProps'. This was causing a TypeScript error. Removed the props from the component call.
        return <NotFoundPage />;
    };

    return (
        <div className="app-container">
            <Header 
                currentRoute={route} 
                onReportBug={() => handleOpenBot('bug_report')}
                theme={theme}
                toggleTheme={toggleTheme} 
            />
            <main className="main-content">
                {renderPage()}
            </main>
            <Footer />
            <GeminiBot 
                currentRoute={route}
                isOpen={isBotOpen}
                setIsOpen={setIsBotOpen}
                intent={botIntent}
                setIntent={setBotIntent}
            />
        </div>
    );
};

export default App;
