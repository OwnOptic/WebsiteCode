import React, { useState, useMemo } from 'react';
import { useI18n } from '../i18n/useI18n';
import Breadcrumb from './Breadcrumb';
import type { BreadcrumbLink } from '../types';
import { Card } from './Card';
import GitHubRepoCard from './GitHubRepoCard';
import '../styles/Projects.css';

interface Project {
    imgSrc: string;
    title: string;
    description: string;
    link: string;
    categoryKey: string;
}

interface GitHubRepo {
    repoName: string;
    description: string;
    stars: string;
    forks: string;
    language?: string;
    repoUrl: string;
}

interface ProjectsProps {
    breadcrumbs: BreadcrumbLink[];
}

const Projects: React.FC<ProjectsProps> = ({ breadcrumbs }) => {
    const { t } = useI18n();
    const headerData = t('projects.header');
    const projectsData = (t('projects.items') || []) as Project[];
    const githubHeader = t('projects.githubHeader');
    const githubProjects = (t('projects.githubProjects') || []) as GitHubRepo[];
    const categories = t('projects.categories') || {};

    const [activeCategory, setActiveCategory] = useState('all');

    const filteredProjects = useMemo(() => {
        if (activeCategory === 'all') {
            return projectsData;
        }
        return projectsData.filter(p => p.categoryKey === activeCategory);
    }, [projectsData, activeCategory]);

    const headerStyle = {
        backgroundImage: `url('https://raw.githubusercontent.com/OwnOptic/Website-storage/main/Augmented%20Intelligence.png')`
    };

    return (
        <div className="projects-page">
            <header className="projects-header">
                <div className="projects-header-bg" style={headerStyle}></div>
                <div className="projects-header-content">
                    <h1>{headerData.title}</h1>
                    <p>{headerData.subtitle}</p>
                </div>
            </header>
            
            <main className="projects-main-content">
                 <Breadcrumb links={breadcrumbs} />

                 <section className="projects-filters">
                    <h3 className="projects-filters-title">{t('projects.filters.title')}</h3>
                    <div className="projects-filters-buttons">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`filter-button ${activeCategory === 'all' ? 'active' : ''}`}
                        >
                            {t('projects.filters.all')}
                        </button>
                        {Object.keys(categories).map(key => (
                            <button
                                key={key}
                                onClick={() => setActiveCategory(key)}
                                className={`filter-button ${activeCategory === key ? 'active' : ''}`}
                            >
                                {categories[key]}
                            </button>
                        ))}
                    </div>
                 </section>

                 <div className="projects-grid">
                     {filteredProjects.map((project: Project, index: number) => (
                         <Card
                            key={index}
                            variant="simple"
                            imageUrl={project.imgSrc}
                            category={categories[project.categoryKey]}
                            title={project.title}
                            description={project.description}
                            link={project.link}
                            buttonText={t('projects.learnMore')}
                         />
                     ))}
                 </div>
                 {filteredProjects.length === 0 && (
                    <div className="projects-no-results">
                        <p>No Projects Found</p>
                        <p>There are no projects in this category yet.</p>
                    </div>
                 )}

                 {githubProjects.length > 0 && githubHeader && (
                     <section className="projects-github-section">
                        <div className="projects-section-header">
                             <h2 className="projects-section-title">{githubHeader.title}</h2>
                             <p className="projects-section-subtitle">{githubHeader.subtitle}</p>
                             <div className="projects-section-divider"></div>
                        </div>
                         <div className="projects-grid">
                            {githubProjects.map((repo, index) => <GitHubRepoCard key={index} {...repo} />)}
                        </div>
                     </section>
                 )}
            </main>
        </div>
    );
};

export default Projects;