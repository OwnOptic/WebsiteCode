import React from 'react';
import { useI18n } from '../i18n/useI18n';
import ChatbotIcon from './icons/ChatbotIcon';
import AutomationIcon from './icons/AutomationIcon';
import StrategyIcon from './icons/StrategyIcon';

interface ServiceCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => (
    <div className="bg-white p-8 rounded-lg custom-shadow text-center transform hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center">
        <div className="inline-block p-4 bg-[var(--interactive-blue)] text-white rounded-full mb-6">
            {icon}
        </div>
        <h4 className="text-[1.563rem] font-semibold text-[var(--primary-text)] mb-3 leading-[1.4]">{title}</h4>
        <p className="text-[var(--secondary-text)] text-[1rem] leading-[1.6]">{description}</p>
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
        <section className="bg-[var(--surface-background)]">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-[2.441rem] font-bold text-[var(--primary-text)] mb-2 leading-[1.2]">{t('expertise.title')}</h2>
                <div className="w-24 h-1 bg-[var(--interactive-blue)] mx-auto mb-12"></div>
                <div className="grid md:grid-cols-3 gap-10">
                    {servicesData.map((service: any, index: number) => (
                        <ServiceCard key={index} icon={icons[index]} title={service.title} description={service.description} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Expertise;
