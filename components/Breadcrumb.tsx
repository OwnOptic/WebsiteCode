import React from 'react';
import type { BreadcrumbLink } from '../types';
import '../styles/Breadcrumb.css';

interface BreadcrumbProps {
    links: BreadcrumbLink[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ links }) => {
    if (!links || links.length === 0) {
        return null;
    }

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        window.location.hash = path;
    };

    return (
        <nav aria-label="breadcrumb" className="breadcrumb">
            <ol className="breadcrumb-list">
                {links.map((link, index) => (
                    <li key={index} className="breadcrumb-item">
                        {index > 0 && (
                            <svg className="breadcrumb-separator-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7-7"></path>
                            </svg>
                        )}
                        {index < links.length - 1 && link.href ? (
                            <a 
                                href={link.href} 
                                onClick={(e) => handleNav(e, link.href!)}
                                className="breadcrumb-link"
                            >
                                {link.label}
                            </a>
                        ) : (
                            <span className="breadcrumb-current-page" aria-current="page">
                                {link.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;