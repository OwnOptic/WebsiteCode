import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../i18n/useI18n';
import * as analytics from '../analytics';
import BrandLogo from './icons/BrandLogo';
import BugIcon from './icons/BugIcon';
import SearchIcon from './icons/SearchIcon';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import SearchModal from './SearchModal';
import '../styles/Header.css';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useI18n();

    const handleLanguageChange = (lang: 'en' | 'fr') => {
        setLanguage(lang);
        analytics.trackEvent('language_switch', { language: lang });
    };

    return (
        <div className="language-switcher">
            <button
                onClick={() => handleLanguageChange('en')}
                className={`language-button ${language === 'en' ? 'active' : ''}`}
                aria-pressed={language === 'en'}
                aria-label="Switch to English"
            >
                EN
            </button>
            <span className="language-separator">/</span>
            <button
                onClick={() => handleLanguageChange('fr')}
                className={`language-button ${language === 'fr' ? 'active' : ''}`}
                aria-pressed={language === 'fr'}
                aria-label="Switch to French"
            >
                FR
            </button>
        </div>
    );
};

interface HeaderProps {
    currentRoute: string;
    onReportBug: () => void;
    theme: string;
    toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentRoute, onReportBug, theme, toggleTheme }) => {
    const { t } = useI18n();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [activeMobileAccordion, setActiveMobileAccordion] = useState<number | null>(null);
    const navRef = useRef<HTMLElement>(null);

    const navItems = t('navItems') || [];

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        window.location.hash = path;
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    };
    
    const handleDropdownToggle = (itemName: string) => {
        setActiveDropdown(prev => (prev === itemName ? null : itemName));
    };

    const handleReportBug = () => {
        analytics.trackEvent('report_bug_click', { placement: 'header' });
        onReportBug();
        setIsMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setActiveDropdown(null);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return (
        <>
            {/* --- Desktop & Tablet Navigation --- */}
            <header className="header-desktop">
                <nav className="header-desktop-nav" ref={navRef}>
                    <div className="header-desktop-container">
                        <a href="#/" onClick={(e) => handleNav(e, '#/')}>
                            <BrandLogo className="brand-logo-desktop" />
                        </a>

                        <ul className="main-nav-list">
                            {navItems.map((item: any) => (
                                <li
                                    key={item.name}
                                    className="nav-item"
                                >
                                    {item.dropdown ? (
                                         <button onClick={() => handleDropdownToggle(item.name)} className="nav-link-button">
                                            {item.name}
                                            <svg className={`dropdown-arrow ${activeDropdown === item.name ? 'active' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </button>
                                    ) : (
                                        <a href={item.href} onClick={(e) => handleNav(e, item.href)} className="nav-link">
                                            {item.name}
                                        </a>
                                    )}
                                   
                                    {item.dropdown && (
                                        <div className={`dropdown-menu ${item.dropdown.featured ? 'featured' : ''} ${activeDropdown === item.name ? 'open' : ''}`}>
                                            <div className={`dropdown-grid ${item.dropdown.featured ? 'featured' : ''}`}>
                                                <div>
                                                    <ul className="dropdown-links">
                                                        {item.dropdown.links.map((link: any) => (
                                                            <li key={link.name} className="sub-nav-item">
                                                                <a href={link.href} onClick={(e) => handleNav(e, link.href)} className="dropdown-link">
                                                                    {link.name}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                {item.dropdown.featured && (
                                                    <a href={item.dropdown.featured.link} onClick={(e) => handleNav(e, item.dropdown.featured.link)} className="featured-item">
                                                        <img src={item.dropdown.featured.image} alt={item.dropdown.featured.alt} className="featured-image-bg" />
                                                        <div className="featured-item-overlay"></div>
                                                        <div className="featured-item-text-content">
                                                            <h5 className="featured-title">{item.dropdown.featured.title}</h5>
                                                            <p className="featured-description">{item.dropdown.featured.description}</p>
                                                            <span className="featured-link">
                                                                {item.dropdown.featured.linkText}
                                                                <svg className="featured-link-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                                            </span>
                                                        </div>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <div className="header-actions">
                            <button onClick={() => setIsSearchOpen(true)} className="search-button" title="Search" aria-label="Search">
                                <SearchIcon className="w-5 h-5" />
                            </button>
                             <button onClick={handleReportBug} className="bug-report-button" title={t('nav.reportBug')} aria-label={t('nav.reportBug')}>
                                <BugIcon className="w-5 h-5" />
                            </button>
                            <button onClick={toggleTheme} className="theme-toggle-button" title="Toggle theme" aria-label="Toggle theme">
                                {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                            </button>
                             <a href="#/contact" onClick={(e) => handleNav(e, '#/contact')} className="contact-button-desktop">
                                {t('contactButton')}
                            </a>
                            <LanguageSwitcher />
                        </div>
                    </div>
                </nav>
            </header>

            {/* --- Mobile Navigation --- */}
            <header className="header-mobile">
                <div className="header-mobile-container">
                    <a href="#/" onClick={(e) => handleNav(e, '#/')}>
                        <BrandLogo className="brand-logo-mobile" />
                    </a>
                    <div className="mobile-actions">
                        <LanguageSwitcher />
                        <button onClick={() => setIsSearchOpen(true)} className="search-button" title="Search" aria-label="Search">
                            <SearchIcon className="w-5 h-5" />
                        </button>
                        <button onClick={toggleTheme} className="theme-toggle-button" title="Toggle theme" aria-label="Toggle theme">
                            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                        </button>
                        <button onClick={() => setIsMobileMenuOpen(true)} className="burger-button" aria-label="Open mobile menu">
                            <svg className="burger-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        </button>
                    </div>
                </div>

                <div className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
                
                <nav className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                    <div className="mobile-menu-header">
                        <h3 className="mobile-menu-title">Navigation</h3>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="close-button" aria-label="Close mobile menu">
                            <svg className="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    <div className="mobile-menu-content">
                        <ul>
                            {navItems.map((item: any, index: number) => (
                                <li key={`mobile-nav-${item.name}`} className="mobile-nav-item">
                                    {item.dropdown ? (
                                        <>
                                            <button onClick={() => setActiveMobileAccordion(activeMobileAccordion === index ? null : index)} className={`mobile-accordion-button ${activeMobileAccordion === index ? 'active' : ''}`}>
                                                {item.name}
                                                <svg className={`mobile-accordion-arrow ${activeMobileAccordion === index ? 'active' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </button>
                                            <div className={`mobile-accordion-panel ${activeMobileAccordion === index ? 'open' : ''}`}>
                                                <div className="mobile-accordion-inner">
                                                    <ul className="mobile-dropdown-links">
                                                        {item.dropdown.links.map((link: any) => (
                                                            <li key={link.name}>
                                                                <a href={link.href} onClick={(e) => handleNav(e, link.href)} className="mobile-dropdown-link">{link.name}</a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <a href={item.href} onClick={(e) => handleNav(e, item.href)} className="mobile-nav-link">{item.name}</a>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleReportBug(); }} className="bug-report-button-mobile">
                            <BugIcon className="w-5 h-5" />
                            {t('nav.reportBug')}
                        </a>
                        <a href="#/contact" onClick={(e) => handleNav(e, '#/contact')} className="contact-button-mobile">
                            {t('contactButton')}
                        </a>
                    </div>
                </nav>
            </header>
            
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};

export default Header;