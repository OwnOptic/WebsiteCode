import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n/useI18n';
import * as analytics from '../analytics';
import BrandLogo from './icons/BrandLogo';

const Logo = () => (
    <div className="flex items-center cursor-pointer">
        <BrandLogo className="h-10 w-auto" />
    </div>
);

const LanguageSwitcher: React.FC<{ isScrolled: boolean; isHomePage: boolean }> = ({ isScrolled, isHomePage }) => {
    const { language, setLanguage } = useI18n();
    const textColor = isScrolled || !isHomePage ? 'text-[var(--primary-text)]' : 'text-white';
    const separatorColor = isScrolled || !isHomePage ? 'text-gray-300' : 'text-gray-400';
    const textShadow = isScrolled || !isHomePage ? '' : '[text-shadow:0_1px_3px_rgba(0,0,0,0.5)]';

    const handleLanguageChange = (lang: 'en' | 'fr') => {
        setLanguage(lang);
        analytics.trackEvent('language_switch', { language: lang });
    };

    return (
        <div className={`flex items-center space-x-1 text-sm font-semibold ${textColor} ${textShadow}`}>
            <button
                onClick={() => handleLanguageChange('en')}
                className={`transition-colors duration-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-[var(--interactive-blue)] ${language === 'en' ? 'text-[var(--interactive-blue)]' : `hover:text-[var(--interactive-blue)]`}`}
                aria-pressed={language === 'en'}
                aria-label="Switch to English"
            >
                EN
            </button>
            <span className={separatorColor}>/</span>
            <button
                onClick={() => handleLanguageChange('fr')}
                className={`transition-colors duration-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-[var(--interactive-blue)] ${language === 'fr' ? 'text-[var(--interactive-blue)]' : `hover:text-[var(--interactive-blue)]`}`}
                aria-pressed={language === 'fr'}
                aria-label="Switch to French"
            >
                FR
            </button>
        </div>
    );
};

const Header: React.FC<{ currentRoute: string }> = ({ currentRoute }) => {
    const { t } = useI18n();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);

    const isHomePage = currentRoute === '#/';
    const isAboutSectionActive = ['#/about', '#/experience', '#/education', '#/certificates'].includes(currentRoute);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 80);
        };
        
        if (isHomePage) {
            handleScroll(); // Set initial state
            window.addEventListener('scroll', handleScroll);
        } else {
            setIsScrolled(true);
        }
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isHomePage]);

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        window.location.hash = path;
        setIsMenuOpen(false);
        setIsAboutDropdownOpen(false);
    };

    const navClass = (isScrolled || !isHomePage)
        ? 'bg-white shadow-md' 
        : 'bg-transparent';
        
    const textShadow = isScrolled || !isHomePage ? '' : '[text-shadow:0_1px_3px_rgba(0,0,0,0.5)]';

    const getLinkClass = (path: string, type: 'desktop' | 'mobile') => {
        const isActive = currentRoute === path || (path === '#/blog' && currentRoute.startsWith('#/blog/'));
        const baseDesktop = isScrolled || !isHomePage ? 'text-[var(--primary-text)]' : 'text-white';
        const activeDesktop = 'text-[var(--interactive-blue)] font-semibold';
        const hoverDesktop = 'hover:text-[var(--interactive-blue)]';
        
        const baseMobile = 'text-gray-700 block py-2 text-center';
        const activeMobile = 'text-[var(--interactive-blue)] font-semibold';
        const hoverMobile = 'hover:text-[var(--interactive-blue)]';

        if(type === 'desktop') {
            return `text-[0.875rem] font-semibold transition-colors duration-200 cursor-pointer ${baseDesktop} ${textShadow} ${isActive ? activeDesktop : hoverDesktop}`;
        }
        return `text-[0.875rem] font-semibold transition-colors duration-200 cursor-pointer ${baseMobile} ${isActive ? activeMobile : hoverMobile}`;
    }
    
    const getDropdownTriggerClass = (type: 'desktop' | 'mobile') => {
        const baseDesktop = isScrolled || !isHomePage ? 'text-[var(--primary-text)]' : 'text-white';
        const activeDesktop = 'text-[var(--interactive-blue)] font-semibold';
        const hoverDesktop = 'hover:text-[var(--interactive-blue)]';

        const baseMobile = 'text-gray-700 w-full text-center py-2';
        const activeMobile = 'text-[var(--interactive-blue)] font-semibold';

        if(type === 'desktop') {
             return `flex items-center gap-1 text-[0.875rem] font-semibold transition-colors duration-200 cursor-pointer ${baseDesktop} ${textShadow} ${isAboutSectionActive ? activeDesktop : hoverDesktop}`;
        }
        return `flex items-center justify-center gap-1 text-[0.875rem] font-semibold transition-colors duration-200 cursor-pointer ${baseMobile} ${isAboutSectionActive ? activeMobile : ''}`;
    }

    const aboutLinks = (isMobile: boolean) => (
        <>
            <a href="#/about" onClick={(e) => handleNav(e, '#/about')} className={isMobile ? getLinkClass('#/about', 'mobile') : 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[var(--interactive-blue)]'}>{t('nav.about')}</a>
            <a href="#/experience" onClick={(e) => handleNav(e, '#/experience')} className={isMobile ? getLinkClass('#/experience', 'mobile') : 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[var(--interactive-blue)]'}>{t('nav.experience')}</a>
            <a href="#/education" onClick={(e) => handleNav(e, '#/education')} className={isMobile ? getLinkClass('#/education', 'mobile') : 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[var(--interactive-blue)]'}>{t('nav.education')}</a>
            <a href="#/certificates" onClick={(e) => handleNav(e, '#/certificates')} className={isMobile ? getLinkClass('#/certificates', 'mobile') : 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[var(--interactive-blue)]'}>{t('nav.certificates')}</a>
        </>
    );

    const desktopNav = (
        <>
            <a href="#/" onClick={(e) => handleNav(e, '#/')} className={getLinkClass('#/', 'desktop')}>{t('nav.home')}</a>
            <div 
                className="relative"
                onMouseEnter={() => setIsAboutDropdownOpen(true)}
                onMouseLeave={() => setIsAboutDropdownOpen(false)}
            >
                <button className={getDropdownTriggerClass('desktop')}>
                    {t('nav.about')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isAboutDropdownOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                        {aboutLinks(false)}
                    </div>
                )}
            </div>
            <a href="#/use-cases" onClick={(e) => handleNav(e, '#/use-cases')} className={getLinkClass('#/use-cases', 'desktop')}>{t('nav.useCases')}</a>
            <a href="#/blog" onClick={(e) => handleNav(e, '#/blog')} className={getLinkClass('#/blog', 'desktop')}>{t('nav.blog')}</a>
            <a href="#/projects" onClick={(e) => handleNav(e, '#/projects')} className={getLinkClass('#/projects', 'desktop')}>{t('nav.projects')}</a>
            <a href="#/contact" onClick={(e) => handleNav(e, '#/contact')} className={`bg-[var(--interactive-blue)] text-white font-semibold py-3 px-6 rounded-[4px] hover:bg-[var(--interactive-hover)] transition-colors duration-200 cursor-pointer w-full md:w-auto text-center text-[0.875rem] ${isScrolled || !isHomePage ? '' : 'shadow-lg'}`}>{t('nav.contact')}</a>
        </>
    );
    
    const mobileNav = (
         <>
            <a href="#/" onClick={(e) => handleNav(e, '#/')} className={getLinkClass('#/', 'mobile')}>{t('nav.home')}</a>
             <details className="w-full text-center">
                <summary className={getDropdownTriggerClass('mobile')}>
                    {t('nav.about')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </summary>
                <div className="pt-2 pb-2 bg-gray-50">
                    {aboutLinks(true)}
                </div>
            </details>
            <a href="#/use-cases" onClick={(e) => handleNav(e, '#/use-cases')} className={getLinkClass('#/use-cases', 'mobile')}>{t('nav.useCases')}</a>
            <a href="#/blog" onClick={(e) => handleNav(e, '#/blog')} className={getLinkClass('#/blog', 'mobile')}>{t('nav.blog')}</a>
            <a href="#/projects" onClick={(e) => handleNav(e, '#/projects')} className={getLinkClass('#/projects', 'mobile')}>{t('nav.projects')}</a>
            <a href="#/contact" onClick={(e) => handleNav(e, '#/contact')} className="bg-[var(--interactive-blue)] text-white font-semibold py-3 px-6 rounded-[4px] hover:bg-[var(--interactive-hover)] transition-colors duration-200 cursor-pointer w-full md:w-auto text-center text-[0.875rem]">{t('nav.contact')}</a>
        </>
    )

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${navClass}`}>
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <a href="#/" onClick={(e) => handleNav(e, '#/')}>
                    <Logo />
                </a>
                <nav className="hidden md:flex items-center space-x-8">
                    {desktopNav}
                    <LanguageSwitcher isScrolled={isScrolled} isHomePage={isHomePage} />
                </nav>
                <div className="md:hidden flex items-center gap-4">
                    <LanguageSwitcher isScrolled={isScrolled} isHomePage={isHomePage} />
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`${isScrolled || !isHomePage ? 'text-[var(--primary-text)]' : 'text-white'} ${textShadow} focus:outline-none`} aria-expanded={isMenuOpen} aria-controls="mobile-menu">
                        <span className="sr-only">Open main menu</span>
                        <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            {isMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16m-7 6h7"></path>}
                        </svg>
                    </button>
                </div>
            </div>
             {isMenuOpen && (
                <div id="mobile-menu" className="md:hidden bg-white shadow-lg">
                    <nav className="flex flex-col items-center space-y-4 p-4">
                       {mobileNav}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
