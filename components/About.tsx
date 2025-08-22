import React from 'react';
import { useI18n } from '../i18n/useI18n';
import LinkedinIcon from './icons/LinkedinIcon';

const About: React.FC = () => {
    const { t } = useI18n();
    const skills = t('about.skills.items') || [];
    const journey = t('about.journey.items') || [];
    
    const headerStyle = {
        backgroundImage: `url('https://raw.githubusercontent.com/OwnOptic/Website-storage/main/The%20Future%20of%20Work.294Z.png')`
    };

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        window.location.hash = path;
    };

    return (
        <div>
             <header className="relative h-[45vh] min-h-[350px] flex items-center justify-center text-center text-white">
                <div className="absolute inset-0 bg-cover bg-center brightness-50" style={headerStyle}></div>
                <div className="relative z-10 p-4">
                    <h1 className="text-4xl md:text-6xl font-bold">{t('about.header.title')}</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-200">{t('about.header.subtitle')}</p>
                </div>
            </header>

            <main className="bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <section className="grid md:grid-cols-[250px_1fr] gap-12 items-center text-center md:text-left mb-16">
                         <div>
                            <img 
                                src="https://github.com/OwnOptic/Website-storage/blob/main/img%20cv.jpg?raw=true"
                                alt="Elliot Margot"
                                className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover shadow-lg mx-auto border-4 border-white"
                                loading="lazy"
                                width="224"
                                height="224"
                            />
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-[var(--primary-text)] mb-4">{t('about.intro.title')}</h3>
                            <p className="text-[var(--secondary-text)] leading-[1.7] text-[1.1rem]">
                                {t('about.intro.p1')}
                            </p>
                             <div className="flex justify-center md:justify-start space-x-4 mt-6">
                                <a href="https://www.linkedin.com/in/elliot-margot-52742a156/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-500 hover:text-[var(--interactive-blue)] transition-colors duration-200">
                                    <LinkedinIcon className="w-8 h-8" />
                                </a>
                            </div>
                        </div>
                    </section>

                    <section className="py-16 border-t border-gray-200">
                        <h2 className="text-[2.441rem] font-bold text-[var(--primary-text)] mb-12 text-center">{t('about.journey.title')}</h2>
                         <div className="relative pl-8 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-1 before:bg-gray-200 before:rounded-full">
                            {journey.map((item: any, index: number) => (
                                <div key={index} className="relative mb-8">
                                    <div className="absolute -left-7 top-1.5 w-5 h-5 bg-[var(--interactive-blue)] rounded-full border-4 border-white"></div>
                                    <h4 className="font-bold text-lg text-[var(--primary-text)]">{item.role}</h4>
                                    <p className="text-sm text-[var(--secondary-text)] font-semibold mb-2">{item.company}</p>
                                    <p className="text-[var(--secondary-text)]">{item.description}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center gap-4 mt-12">
                            <a href="#/experience" onClick={(e) => handleNav(e, '#/experience')} className="bg-gray-100 text-[var(--primary-text)] font-semibold py-3 px-6 rounded-[4px] hover:bg-gray-200 transition-colors duration-200">{t('about.journey.ctaExperience')}</a>
                            <a href="#/education" onClick={(e) => handleNav(e, '#/education')} className="bg-gray-100 text-[var(--primary-text)] font-semibold py-3 px-6 rounded-[4px] hover:bg-gray-200 transition-colors duration-200">{t('about.journey.ctaEducation')}</a>
                        </div>
                    </section>

                    <section className="py-16 border-t border-gray-200">
                        <h2 className="text-[2.441rem] font-bold text-[var(--primary-text)] mb-12 text-center">{t('about.skills.title')}</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {skills.map((skill: any, index: number) => (
                                <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                    <h4 className="font-bold text-lg text-[var(--primary-text)] mb-2">{skill.name}</h4>
                                    <p className="text-sm text-[var(--secondary-text)]">{skill.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default About;