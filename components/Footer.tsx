import React from 'react';
import { useI18n } from '../i18n/useI18n';
import GithubIcon from './icons/GithubIcon';
import '../styles/Footer.css';

const Footer: React.FC = () => {
    const { t } = useI18n();
    const currentYear = new Date().getFullYear();

    const socialLogos = [
        {
            href: "https://www.witivio.com/",
            src: "https://www.salon-intranet.com/logo/7efb633c8de1d45logo-hd_witivio.png",
            alt: "Witivio Logo",
            title: "Visit Witivio"
        },
        {
            href: "https://www.linkedin.com/in/elliot-margot-52742a156/",
            src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/960px-LinkedIn_logo_initials.png",
            alt: "LinkedIn Logo",
            title: "Visit Elliot Margot's LinkedIn"
        }
    ];

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        window.location.hash = path;
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Column 1: Name & Copyright */}
                <div className="footer-column">
                    <h3 className="footer-title">Elliot Margot</h3>
                    <p className="footer-copyright">{t('footer.copyright', { year: currentYear.toString() })}</p>
                     <div className="footer-socials">
                        {socialLogos.map(logo => (
                            <a key={logo.alt} href={logo.href} target="_blank" rel="noopener noreferrer" title={logo.title} className="footer-social-link">
                                <img 
                                    src={logo.src} 
                                    alt={logo.alt} 
                                    className="footer-social-image"
                                    loading="lazy"
                                    width="40"
                                    height="40"
                                />
                            </a>
                        ))}
                         <a href="https://github.com/OwnOptic" target="_blank" rel="noopener noreferrer" title="Visit Elliot Margot's GitHub" className="footer-social-link github">
                            <GithubIcon className="footer-social-icon" />
                        </a>
                    </div>
                </div>

                {/* Column 2: Site Map */}
                <div className="footer-column">
                    <h4 className="footer-subtitle">{t('footer.siteMap')}</h4>
                    <nav className="footer-sitemap">
                        <a href="#/" onClick={(e) => handleNav(e, '#/')} className="footer-sitemap-link">{t('nav.home')}</a>
                        <a href="#/about" onClick={(e) => handleNav(e, '#/about')} className="footer-sitemap-link">{t('nav.about')}</a>
                        <a href="#/use-cases" onClick={(e) => handleNav(e, '#/use-cases')} className="footer-sitemap-link">{t('nav.useCases')}</a>
                        <a href="#/projects" onClick={(e) => handleNav(e, '#/projects')} className="footer-sitemap-link">{t('nav.projects')}</a>
                        <a href="#/tech-stack" onClick={(e) => handleNav(e, '#/tech-stack')} className="footer-sitemap-link">{t('nav.techStack')}</a>
                        <a href="#/contact" onClick={(e) => handleNav(e, '#/contact')} className="footer-sitemap-link">{t('nav.contact')}</a>
                        <a href="#/sitemap" onClick={(e) => handleNav(e, '#/sitemap')} className="footer-sitemap-link">{t('nav.sitemap')}</a>
                    </nav>
                </div>

                {/* Column 3: Contact Me CTA */}
                 <div className="footer-column">
                    <h4 className="footer-subtitle">{t('footer.contactMe.title')}</h4>
                    <p className="footer-cta-description">{t('footer.contactMe.description')}</p>
                     <a 
                        href="#/contact" 
                        onClick={(e) => handleNav(e, '#/contact')} 
                        className="footer-cta-button"
                    >
                        {t('footer.contactMe.buttonText')}
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;