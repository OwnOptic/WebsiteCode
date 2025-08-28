import React from 'react';
import { CodeIdeIcon, BrainIcon, SwissFlagIcon, PowerPlatformIcon, GeminiIcon, VsCodeIcon, ReactIcon, MicrosoftCopilotIcon, CopilotStudioIcon, GermanyFlagIcon, ChatGptIcon, ClaudeIcon } from './index';
import '../styles/AnimatedHero.css';

interface AnimatedHeroProps {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
}

const AnimatedHero: React.FC<AnimatedHeroProps> = ({ title, subtitle, buttonText, buttonLink }) => {
    
    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        window.location.hash = href;
    };

    return (
        <section className="animated-hero-section">
            <div className="animated-hero-background">
                <div className="shape-1"></div>
                <div className="shape-2"></div>
                <div className="shape-3"></div>
                <div className="icon-float icon-1">
                    <CodeIdeIcon />
                </div>
                 <div className="icon-float icon-2">
                    <BrainIcon />
                </div>
                 <div className="icon-float icon-3">
                    <SwissFlagIcon />
                </div>
                <div className="icon-float icon-4">
                    <PowerPlatformIcon />
                </div>
                <div className="icon-float icon-5">
                    <GeminiIcon />
                </div>
                <div className="icon-float icon-6">
                    <VsCodeIcon />
                </div>
                <div className="icon-float icon-7">
                    <ReactIcon />
                </div>
                <div className="icon-float icon-8">
                    <MicrosoftCopilotIcon />
                </div>
                <div className="icon-float icon-9">
                    <CopilotStudioIcon />
                </div>
                <div className="icon-float icon-10">
                    <GermanyFlagIcon />
                </div>
                <div className="icon-float icon-11">
                    <ChatGptIcon />
                </div>
                <div className="icon-float icon-12">
                    <ClaudeIcon />
                </div>
            </div>
            <div className="animated-hero-content">
                <h1 className="animated-hero-title">{title}</h1>
                <p className="animated-hero-subtitle">{subtitle}</p>
                <a href={buttonLink} onClick={(e) => handleNav(e, buttonLink)} className="animated-hero-button">
                    {buttonText}
                </a>
            </div>
        </section>
    );
};

export default AnimatedHero;