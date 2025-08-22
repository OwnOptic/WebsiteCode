import React from 'react';
import { useI18n } from '../i18n/useI18n';

interface ProjectItemProps {
    imgSrc: string;
    title: string;
    description: string;
    link: string;
}

const ProjectCard: React.FC<ProjectItemProps> = ({ imgSrc, title, description, link }) => {
    const { t } = useI18n();
    
    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.hash = link;
    };

    return (
        <a href={link} onClick={handleNav} className="block group">
            <div className="bg-white rounded-lg overflow-hidden custom-shadow flex flex-col h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                <img src={imgSrc} alt={title} className="w-full h-80 object-cover" loading="lazy" width="400" height="320" />
                <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-semibold text-[var(--primary-text)] mb-3 leading-[1.3]">{title}</h3>
                    <p className="text-[var(--secondary-text)] leading-relaxed mb-6 flex-grow">{description}</p>
                    <span className="font-semibold text-[var(--interactive-blue)] group-hover:text-[var(--interactive-hover)] transition-colors self-start">
                        {t('projects.learnMore')} &rarr;
                    </span>
                </div>
            </div>
        </a>
    );
};

const Projects: React.FC = () => {
    const { t } = useI18n();
    const headerData = t('projects.header');
    const projectsData = t('projects.items') || [];

    const headerStyle = {
        backgroundImage: `url('https://raw.githubusercontent.com/OwnOptic/Website-storage/main/Augmented%20Intelligence.png')`
    };

    return (
        <div className="bg-[var(--surface-background)] min-h-screen">
            <header className="relative h-[45vh] min-h-[350px] flex items-center justify-center text-center text-white">
                <div className="absolute inset-0 bg-cover bg-center brightness-50" style={headerStyle}></div>
                <div className="relative z-10 p-4">
                    <h1 className="text-4xl md:text-6xl font-bold">{headerData.title}</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-200">{headerData.subtitle}</p>
                </div>
            </header>
            
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                 <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10 text-left">
                     {projectsData.map((item: ProjectItemProps, index: number) => (
                         <ProjectCard key={index} {...item} />
                     ))}
                 </div>
            </main>
        </div>
    );
};

export default Projects;