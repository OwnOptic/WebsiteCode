import React from 'react';
import { useI18n } from '../i18n/useI18n';
import ProjectDetailLayout from '../components/ProjectDetailLayout';

const ProjectDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
    const { t } = useI18n();
    const projectData = t(`projects.details.${slug}`);

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        window.location.hash = path;
    };

    if (!projectData || typeof projectData !== 'object') {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-center px-4 py-24">
                <div>
                    <h1 className="text-4xl font-bold text-[var(--primary-text)] mb-4">Project Not Found</h1>
                    <p className="text-lg text-[var(--secondary-text)] max-w-md mx-auto">
                        Sorry, we couldn't find the project you were looking for. It might have been moved or the link is incorrect.
                    </p>
                    <a href="#/projects" onClick={(e) => handleNav(e, '#/projects')} className="mt-8 inline-block bg-[var(--interactive-blue)] text-white font-semibold py-3 px-6 rounded-[4px] hover:bg-[var(--interactive-hover)] transition-colors duration-200">
                        &larr; Back to All Projects
                    </a>
                </div>
            </div>
        );
    }

    return <ProjectDetailLayout project={projectData} />;
};

export default ProjectDetailPage;
