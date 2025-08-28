import React from 'react';
import ArrowRightIcon from './icons/ArrowRightIcon';
import { ReactIcon, GeminiIcon, PowerAutomateIcon, BrainIcon, StrategyIcon, CopilotStudioIcon } from './index';
import AzureIcon from './icons/AzureIcon';
import CodeIcon from './icons/CodeIcon';
import PowerBiIcon from './icons/PowerBiIcon';
import OpenAiIcon from './icons/OpenAiIcon';
import '../styles/Card.css';

const techIconMap: { [key: string]: React.ReactNode } = {
    'AzureIcon': <AzureIcon />,
    'PythonIcon': <CodeIcon className="h-5 w-5 text-green-500" />,
    'CodeIcon': <CodeIcon className="h-5 w-5" />,
    'PowerBiIcon': <PowerBiIcon />,
    'OpenAiIcon': <OpenAiIcon />,
    'ReactIcon': <ReactIcon />,
    'GeminiIcon': <GeminiIcon />,
    'PowerAutomateIcon': <PowerAutomateIcon />,
    'BrainIcon': <BrainIcon />,
    'StrategyIcon': <StrategyIcon />,
    'CopilotStudioIcon': <CopilotStudioIcon />,
};

export interface CardProps {
    variant: 'simple' | 'project-overview-light' | 'project-overview-dark' | 'carousel';
    imageUrl?: string;
    category?: string;
    title: string;
    description?: string;
    buttonText?: string;
    link?: string;
    timeline?: string;
    techStack?: string[];
    layout?: 'large';
}

export const Card: React.FC<CardProps> = (props) => {
    const { variant, imageUrl, category, title, description, buttonText, link, timeline, techStack } = props;

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (link) window.location.hash = link;
    };

    const cardContent = () => {
        switch (variant) {
            case 'carousel':
                return (
                    <div className="card-carousel group">
                        {imageUrl && (
                            <div className="card-carousel-image-wrapper">
                                <img className="card-carousel-image" src={imageUrl} alt={title} loading="lazy" />
                                <div className="card-carousel-overlay"></div>
                            </div>
                        )}
                        <div className="card-carousel-content">
                            <h3 className="card-carousel-title">{title}</h3>
                        </div>
                    </div>
                );
            case 'simple':
                return (
                    <div className="card-simple group">
                        {imageUrl && <div className="card-simple-image-wrapper"><img className="card-simple-image" src={imageUrl} alt={title} loading="lazy" /></div>}
                        <div className="card-simple-content">
                            {category && <p className="card-simple-category">{category}</p>}
                            <h3 className="card-simple-title">{title}</h3>
                            {description && <p className="card-simple-description">{description}</p>}
                            {buttonText && (
                                <div className="card-simple-button-wrapper">
                                    <span className="card-simple-button">{buttonText}<ArrowRightIcon /></span>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'project-overview-light':
            case 'project-overview-dark':
                const isDark = variant === 'project-overview-dark';
                return (
                    <div className={`card-project-overview ${isDark ? 'dark' : 'light'} group`}>
                        {imageUrl && (
                            <div className="card-project-image-wrapper">
                                <img src={imageUrl} className="card-project-image" alt={title} loading="lazy" />
                            </div>
                        )}
                        <div className="card-project-content">
                            <div>
                                {category && <p className={`card-project-category ${isDark ? 'dark' : 'light'}`}>{category}</p>}
                                <h2 className={`card-project-title ${isDark ? 'dark' : 'light'}`}>{title}</h2>
                                {description && <p className={`card-project-description ${isDark ? 'dark' : 'light'}`}>{description}</p>}
                            </div>
                             <div className="card-project-divider"></div>
                            {(timeline || techStack) && (
                                <div className={`card-project-footer ${isDark ? 'dark' : 'light'}`}>
                                    <div className="card-project-footer-content">
                                        {timeline && (
                                            <div>
                                                <p className={`card-project-meta-label ${isDark ? 'dark' : 'light'}`}>TIMELINE</p>
                                                <p className={`card-project-meta-value ${isDark ? 'dark' : 'light'}`}>{timeline}</p>
                                            </div>
                                        )}
                                        {techStack && (
                                            <div className="text-right">
                                                <p className={`card-project-meta-label ${isDark ? 'dark' : 'light'}`}>TECH STACK</p>
                                                <div className="card-project-tech-stack">
                                                    {(techStack || []).map(tech => (
                                                        <div key={tech} className={`card-project-tech-icon ${isDark ? 'dark' : 'light'}`} title={tech}>
                                                            {techIconMap[tech]}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return link ? <a href={link} onClick={handleNav} className="block h-full">{cardContent()}</a> : <div className="h-full">{cardContent()}</div>;
};