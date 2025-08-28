import React from 'react';
import { useI18n } from '../i18n/useI18n';
import LinkedinIcon from './icons/LinkedinIcon';
import Breadcrumb from './Breadcrumb';
import type { BreadcrumbLink } from '../types';
import HeroV2 from './HeroV2';
import CardGrid from './CardGrid';
import GitHubUserCard from './GitHubUserCard';
import Timeline from './Timeline';
import { SwissFlagIcon, GermanyFlagIcon, FranceFlagIcon, UKFlagIcon } from './index';
import '../styles/About.css';

interface AboutProps {
    breadcrumbs: BreadcrumbLink[];
}

const About: React.FC<AboutProps> = ({ breadcrumbs }) => {
    const { t } = useI18n();
    const aboutData = t('about');

    if (!aboutData || !aboutData.heroV2 || !aboutData.header) return null;

    const { header, heroV2, intro, journey, skills, cardGrid, github, latestProject } = aboutData;

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        window.location.hash = path;
    };

    const journeyItems = (journey.items || []).map((item: any) => ({
        title: item.role,
        subtitle: item.company,
        period: item.period,
        description: [item.description],
        imageUrl: item.imageUrl,
        techStack: item.techStack,
    }));

    return (
        <div>
            <HeroV2 
                variant="full-centered-gradient"
                imageUrl={heroV2.imageUrl}
                title={header.title}
                subtitle={header.subtitle}
            />

            <main className="about-page-main">
                <div className="about-page-container">
                    <Breadcrumb links={breadcrumbs} />
                    <section className="about-intro-section">
                         <div>
                            <img 
                                src="https://github.com/OwnOptic/Website-storage/blob/main/img%20cv.jpg?raw=true"
                                alt="Elliot Margot"
                                className="about-profile-image"
                                loading="lazy"
                                width="224"
                                height="224"
                            />
                        </div>
                        <div className="about-intro-content">
                            <h3 className="about-intro-title">{intro.title}</h3>
                            <p className="about-intro-text">
                                {intro.p1}
                            </p>
                             <div className="about-socials">
                                <a href="https://www.linkedin.com/in/elliot-margot-52742a156/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="about-social-link">
                                    <LinkedinIcon className="w-8 h-8" />
                                </a>
                                <SwissFlagIcon className="w-8 h-8" title="Swiss" />
                                <GermanyFlagIcon className="w-8 h-8" title="German"/>
                                <FranceFlagIcon className="w-8 h-8" title="French" />
                                <UKFlagIcon className="w-8 h-8" title="English"/>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="about-section-title">{journey.title}</h2>
                        <Timeline items={journeyItems} />
                        <div className="about-cta-container">
                            <a href="#/experience" onClick={(e) => handleNav(e, '#/experience')} className="about-cta-button">{journey.ctaExperience}</a>
                            <a href="#/education" onClick={(e) => handleNav(e, '#/education')} className="about-cta-button">{journey.ctaEducation}</a>
                        </div>
                    </section>

                    {latestProject && (
                        <section className="about-section-center">
                            <h2 className="about-section-title">{latestProject.title}</h2>
                             <div className="latest-project-card">
                                <h3>{latestProject.subtitle}</h3>
                                <p>{latestProject.description}</p>
                            </div>
                        </section>
                    )}

                    {github && (
                        <section className="about-section-center">
                           <h2 className="about-section-title">{github.title}</h2>
                           <GitHubUserCard {...github.profile} />
                       </section>
                    )}

                    <section>
                         {skills && cardGrid && (
                            <CardGrid 
                                title={skills.title}
                                cards={cardGrid.cards}
                            />
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default About;