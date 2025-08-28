import React from 'react';
import { useI18n } from '../i18n/useI18n';
import ChatbotIcon from './icons/ChatbotIcon';
import AutomationIcon from './icons/AutomationIcon';
import StrategyIcon from './icons/StrategyIcon';
import '../styles/Expertise.css';

interface ServiceCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => (
    <div className="expertise-card">
        <div className="expertise-card-icon-wrapper">
            {icon}
        </div>
        <h4 className="expertise-card-title">{title}</h4>
        <p className="expertise-card-description">{description}</p>
    </div>
);


const Expertise: React.FC = () => {
    const { t } = useI18n();
    const servicesData = t('expertise.items');
    
    const icons = [
        <ChatbotIcon className="w-8 h-8" />,
        <AutomationIcon className="w-8 h-8" />,
        <StrategyIcon className="w-8 h-8" />
    ];

    return (
        <section className="expertise-section">
            <div className="expertise-container">
                <h2 className="expertise-title">{t('expertise.title')}</h2>
                <div className="expertise-divider"></div>
                <div className="expertise-grid">
                    {servicesData.map((service: any, index: number) => (
                        <ServiceCard key={index} icon={icons[index]} title={service.title} description={service.description} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Expertise;