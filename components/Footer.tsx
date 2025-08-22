import React from 'react';
import { useI18n } from '../i18n/useI18n';

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
        <footer className="bg-[var(--footer-background)] text-[var(--footer-text)] py-16 px-6">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                {/* Column 1: Name & Copyright */}
                <div>
                    <h3 className="text-2xl font-bold mb-2">Elliot Margot</h3>
                    <p className="text-sm text-[var(--footer-copyright)]">{t('footer.copyright', { year: currentYear.toString() })}</p>
                     <div className="flex items-center justify-center md:justify-start gap-5 mt-6">
                        {socialLogos.map(logo => (
                            <a key={logo.alt} href={logo.href} target="_blank" rel="noopener noreferrer" title={logo.title}>
                                <img 
                                    src={logo.src} 
                                    alt={logo.alt} 
                                    className="h-10 w-auto transition-transform duration-200 ease-in-out hover:scale-110"
                                    loading="lazy"
                                    width="40"
                                    height="40"
                                />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Column 2: Site Map */}
                <div>
                    <h4 className="text-lg font-semibold mb-4">{t('footer.siteMap')}</h4>
                    <nav className="flex flex-col space-y-2">
                        <a href="#/" onClick={(e) => handleNav(e, '#/')} className="text-[var(--footer-copyright)] hover:text-white transition-colors">{t('nav.home')}</a>
                        <a href="#/about" onClick={(e) => handleNav(e, '#/about')} className="text-[var(--footer-copyright)] hover:text-white transition-colors">{t('nav.about')}</a>
                        <a href="#/use-cases" onClick={(e) => handleNav(e, '#/use-cases')} className="text-[var(--footer-copyright)] hover:text-white transition-colors">{t('nav.useCases')}</a>
                        <a href="#/blog" onClick={(e) => handleNav(e, '#/blog')} className="text-[var(--footer-copyright)] hover:text-white transition-colors">{t('nav.blog')}</a>
                        <a href="#/projects" onClick={(e) => handleNav(e, '#/projects')} className="text-[var(--footer-copyright)] hover:text-white transition-colors">{t('nav.projects')}</a>
                        <a href="#/tech-stack" onClick={(e) => handleNav(e, '#/tech-stack')} className="text-[var(--footer-copyright)] hover:text-white transition-colors">{t('nav.techStack')}</a>
                        <a href="#/contact" onClick={(e) => handleNav(e, '#/contact')} className="text-[var(--footer-copyright)] hover:text-white transition-colors">{t('nav.contact')}</a>
                    </nav>
                </div>

                {/* Column 3: Contact Me CTA */}
                 <div>
                    <h4 className="text-lg font-semibold mb-4">{t('footer.contactMe.title')}</h4>
                    <p className="text-sm text-[var(--footer-copyright)] mb-6">{t('footer.contactMe.description')}</p>
                     <a 
                        href="#/contact" 
                        onClick={(e) => handleNav(e, '#/contact')} 
                        className="inline-block bg-[var(--interactive-blue)] text-white font-semibold py-3 px-6 rounded-[4px] hover:bg-[var(--interactive-hover)] transition-colors duration-200 cursor-pointer text-[0.875rem]"
                    >
                        {t('footer.contactMe.buttonText')}
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;