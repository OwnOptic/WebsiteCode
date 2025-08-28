import React from 'react';
import HomeIcon from './icons/HomeIcon';
import AnalyticsIcon from './icons/AnalyticsIcon';
import UsersIcon from './icons/UsersIcon';
import type { BreadcrumbLink } from '../types';
import '../styles/PillBreadcrumb.css';

interface PillBreadcrumbProps {
    links: BreadcrumbLink[];
}

const iconMap: { [key: string]: React.FC<{className?: string}> } = {
    'Home': HomeIcon,
    'Projects': AnalyticsIcon,
    'Default': UsersIcon,
};

const colorMap: { [key: string]: string } = {
    'Home': 'indigo',
    'Projects': 'purple',
    'Default': 'gray',
};

const PillBreadcrumb: React.FC<PillBreadcrumbProps> = ({ links }) => {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.location.hash = href;
  };
  
  if (!links || links.length === 0) return null;

  return (
      <nav className="pill-breadcrumb-nav" aria-label="Breadcrumb">
        <ol className="pill-breadcrumb-list">
            {links.map((link, index) => {
                const isLast = index === links.length - 1;
                const Icon = iconMap[link.icon || link.label] || iconMap['Default'];
                const color = colorMap[link.icon || link.label] || colorMap['Default'];
                
                return (
                    <li key={index} className="pill-breadcrumb-item">
                        {index > 0 && (
                            <span className="pill-breadcrumb-separator">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </span>
                        )}
                        {isLast ? (
                             <span className="pill-breadcrumb-link current">
                                <Icon className="pill-breadcrumb-icon" />
                                {link.label}
                            </span>
                        ) : (
                            <a href={link.href} onClick={(e) => handleNav(e, link.href!)} className={`pill-breadcrumb-link ${color}`}>
                                <Icon className="pill-breadcrumb-icon" />
                                {link.label}
                            </a>
                        )}
                    </li>
                );
            })}
        </ol>
      </nav>
  );
}

export default PillBreadcrumb;