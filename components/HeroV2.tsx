import React, { useState } from 'react';
import '../styles/HeroV2.css';

type HeroVariant = 
    | 'split-right-image' 
    | 'full-centered-gradient'
    | 'split-left-image'
    | 'full-left-overlay'
    | 'full-bottom-overlay'
    | 'full-right-callout'
    | 'split-image-left-interactive';

interface HeroV2Props {
    variant: HeroVariant;
    imageUrl: string;
    title: string;
    subtitle: string;
    buttonText?: string;
    buttonLink?: string;
}

const HeroV2: React.FC<HeroV2Props> = ({ variant, imageUrl, title, subtitle, buttonText, buttonLink }) => {

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        window.location.hash = href;
    };
    
    const getVariantClassName = () => {
        switch (variant) {
            case 'split-right-image': return 'hero-split-right-image';
            case 'full-centered-gradient': return 'hero-full-centered-gradient';
            default: return 'hero-split-right-image'; // Default fallback
        }
    }

    return (
        <section className={`hero-section ${getVariantClassName()}`}>
             <div className="hero-image-container">
                <img src={imageUrl} alt="" className="hero-image" />
                {variant === 'full-centered-gradient' && <div className="hero-gradient-overlay"></div>}
            </div>
            <div className="hero-content-container">
                <div className="hero-content">
                    <h2 className="hero-title">{title}</h2>
                    <p className="hero-subtitle">{subtitle}</p>
                    {buttonText && buttonLink && 
                        <a href={buttonLink} onClick={(e) => handleNav(e, buttonLink)} className="hero-button">
                            {buttonText}
                        </a>
                    }
                </div>
            </div>
        </section>
    );
};

export default HeroV2;