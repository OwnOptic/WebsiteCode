import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n/useI18n';
import Breadcrumb from '../components/Breadcrumb';
import type { BreadcrumbLink } from '../types';
import '../styles/SitemapPage.css';

interface SitemapPageProps {
    breadcrumbs: BreadcrumbLink[];
}

const SitemapPage: React.FC<SitemapPageProps> = ({ breadcrumbs }) => {
    const { t } = useI18n();
    const [urls, setUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSitemap = async () => {
            try {
                const response = await fetch('/sitemap.txt');
                const text = await response.text();
                const urlList = text.split('\n').filter(line => line.trim() !== '');
                setUrls(urlList);
            } catch (error) {
                console.error("Failed to fetch sitemap:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSitemap();
    }, []);
    
    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        window.location.hash = path;
    };

    const formatUrlText = (url: string) => {
        try {
            const path = new URL(url).hash.replace(/^#\//, '');
            if (!path) return 'Home';
            return path
                .split('/')
                .map(part => part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
                .join(' > ');
        } catch (e) {
            return url;
        }
    };

    return (
        <div className="sitemap-page-container">
            <Breadcrumb links={breadcrumbs} />
            <header className="sitemap-page-header">
                <h1>{t('sitemap.header.title')}</h1>
                <p>{t('sitemap.header.subtitle')}</p>
            </header>

            {loading ? (
                <p>Loading sitemap...</p>
            ) : (
                <ul className="sitemap-list">
                    {urls.map((url, index) => {
                         const path = new URL(url).hash;
                         return (
                            <li key={index}>
                                <a href={path} onClick={(e) => handleNav(e, path)}>
                                    {formatUrlText(url)}
                                </a>
                            </li>
                         );
                    })}
                </ul>
            )}
        </div>
    );
};

export default SitemapPage;