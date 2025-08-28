import React from 'react';
import { useI18n } from '../i18n/useI18n';
import Breadcrumb from './Breadcrumb';
import type { BreadcrumbLink } from '../types';
import { Card } from './Card';
import '../styles/OpenSource.css';

interface Project {
    imgSrc: string;
    title: string;
    description: string;
    link: string;
    categoryKey: string;
}

interface OpenSourceProps {
    breadcrumbs: BreadcrumbLink[];
}

const OpenSource: React.FC<OpenSourceProps> = ({ breadcrumbs }) => {
    const { t } = useI18n();
    const headerData = t('openSource.header');
    const projectsData = (t('openSource.items') || []) as Project[];
    
    if (!headerData) return null;

    const headerStyle = {
        backgroundImage: `url('${headerData.imageUrl}')`
    };

    return (
        <div className="open-source-page">
            <header className="open-source-header">
                <div className="open-source-header-bg" style={headerStyle}></div>
                <div className="open-source-header-content">
                    <h1>{headerData.title}</h1>
                    <p>{headerData.subtitle}</p>
                </div>
            </header>
            
            <main className="open-source-main-content">
                <Breadcrumb links={breadcrumbs} />

                <div className="open-source-grid">
                    {projectsData.map((project: Project, index: number) => (
                        <Card
                            key={index}
                            variant="simple"
                            imageUrl={project.imgSrc}
                            category={project.categoryKey}
                            title={project.title}
                            description={project.description}
                            link={project.link}
                            buttonText={t('projects.learnMore')}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default OpenSource;