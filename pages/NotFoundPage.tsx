import React from 'react';
import { useI18n } from '../i18n/useI18n';
import { Card } from '../components/Card';
import { BrainIcon, CodeIdeIcon, GeminiIcon, PowerPlatformIcon, ReactIcon, SwissFlagIcon, VsCodeIcon } from '../components';
import '../styles/NotFoundPage.css';

const FloatingIcons = () => (
    <div className="floating-icons-background" aria-hidden="true">
        <div className="icon-wrapper" style={{ top: '10%', left: '15%', animationDuration: '15s' }}><ReactIcon /></div>
        <div className="icon-wrapper" style={{ top: '25%', left: '80%', animationDuration: '12s' }}><GeminiIcon /></div>
        <div className="icon-wrapper" style={{ top: '70%', left: '10%', animationDuration: '18s' }}><PowerPlatformIcon /></div>
        <div className="icon-wrapper" style={{ top: '80%', left: '85%', animationDuration: '10s' }}><VsCodeIcon /></div>
        <div className="icon-wrapper" style={{ top: '5%', left: '50%', animationDuration: '14s' }}><BrainIcon /></div>
        <div className="icon-wrapper" style={{ top: '85%', left: '45%', animationDuration: '16s' }}><CodeIdeIcon /></div>
        <div className="icon-wrapper" style={{ top: '50%', left: '90%', animationDuration: '11s' }}><SwissFlagIcon /></div>
    </div>
);

const NotFoundPage: React.FC = () => {
    const { t } = useI18n();
    const notFoundData = t('notFound');
    const allProjects = t('projects.items') || [];
    
    const suggestedProjects = notFoundData?.projectSlugs
        .map((slug: string) => allProjects.find((p: any) => p.slug === slug))
        .filter(Boolean);
        
    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        window.location.hash = path;
    };

    if (!notFoundData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="not-found-page">
            <FloatingIcons />
            <div className="not-found-content">
                <h1 className="not-found-title">{notFoundData.title}</h1>
                <h2 className="not-found-subtitle">{notFoundData.subtitle}</h2>
                <p className="not-found-text">{notFoundData.text}</p>
                <a href="#/" onClick={(e) => handleNav(e, '#/')} className="not-found-button">
                    {notFoundData.buttonText}
                </a>
                
                {suggestedProjects && suggestedProjects.length > 0 && (
                    <div className="not-found-suggestions">
                        <h3 className="suggestions-title">{notFoundData.suggestionsTitle}</h3>
                        <div className="suggestions-grid">
                            {suggestedProjects.map((project: any) => (
                                <Card
                                    key={project.slug}
                                    variant="simple"
                                    imageUrl={project.imgSrc}
                                    title={project.title}
                                    description={project.description}
                                    link={project.link}
                                    buttonText="View Project"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotFoundPage;