import React from 'react';
import CheckShieldIcon from './icons/CheckShieldIcon';
import MobileIcon from './icons/MobileIcon';
import PowerPlatformIcon from './icons/PowerPlatformIcon';
import BrainIcon from './icons/BrainIcon';
import StrategyIcon from './icons/StrategyIcon';
import '../styles/IconFeatureList.css';

const iconMap: { [key: string]: React.ReactNode } = {
    'BrainIcon': <BrainIcon />,
    'CheckShieldIcon': <CheckShieldIcon />,
    'StrategyIcon': <StrategyIcon />,
    'MobileIcon': <MobileIcon />,
    'PowerPlatformIcon': <PowerPlatformIcon />
};

interface Feature {
    icon: string;
    title: string;
    description: string;
}

interface IconFeatureListProps {
    title?: string;
    items: Feature[];
    variant: 'single-column' | 'two-columns';
}

const IconFeatureList: React.FC<IconFeatureListProps> = ({ title, items, variant }) => {
    
    if (variant === 'single-column') {
        return (
            <div className="feature-list-single-col">
                {items.map((item, index) => (
                     <div key={index} className="feature-item-single-col">
                        <div className="feature-item-icon-wrapper">
                            {iconMap[item.icon]}
                        </div>
                        <div>
                            <h4 className="feature-item-title">{item.title}</h4>
                            <p className="feature-item-description">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (variant === 'two-columns') {
        return (
            <div className="feature-list-container">
                {title && (
                     <>
                        <h2 className="feature-list-title">{title}</h2>
                        <div className="feature-list-divider"></div>
                    </>
                )}
                <div className="feature-list-grid">
                    {items.map((item, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon-wrapper">
                                {iconMap[item.icon]}
                            </div>
                            <h3 className="feature-card-title">{item.title}</h3>
                            <p className="feature-card-description">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};

export default IconFeatureList;