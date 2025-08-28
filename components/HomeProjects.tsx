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
                <div className="p-6 flex flex-col flex-grow">
                    <h4 className="text-[1.563rem] font-semibold text-[var(--primary-text)] mb-3 leading-[1.4]">{title}</h4>
                    <p className="text-[var(--secondary-text)] text-[1rem] leading-[1.6] mb-4 flex-grow">{description}</p>
                    <span className="text-[var(--interactive-blue)] font-semibold group-hover:text-[var(--interactive-hover)] transition-colors self-start">
                        {t('homePage.projects.learnMore')}
                    </span>
                </div>
            </div>
        </a>
    );
};


const HomeProjects: React.FC = () => {
    const { t } = useI18n();
    const projectsData = t('homePage.projects.items');

    return (
        <section>
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-[2.441rem] font-bold text-[var(--primary-text)] mb-2 leading-[1.2]">{t('homePage.projects.title')}</h2>
                 <div className="w-24 h-1 bg-[var(--interactive-blue)] mx-auto mb-12"></div>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                     {projectsData.map((item: ProjectItemProps, index: number) => (
                         <ProjectCard key={index} {...item} />
                     ))}
                 </div>
            </div>
        </section>
    );
};

export default HomeProjects;