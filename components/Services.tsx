import React from 'react';
import { useI18n } from '../i18n/useI18n';
import DesignIcon from './icons/DesignIcon';
import SeoIcon from './icons/SeoIcon';
import MaintenanceIcon from './icons/MaintenanceIcon';

interface ServiceCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => (
    <div className="bg-[var(--surface-background)] p-6 rounded-lg custom-shadow text-center transform hover:-translate-y-2 transition-transform duration-300">
        <div className="inline-block p-4 bg-[var(--interactive-blue)] text-white rounded-full mb-4">
            {icon}
        </div>
        <h4 className="text-[1.563rem] font-semibold text-[var(--primary-text)] mb-2 leading-[1.4]">{title}</h4>
        <p className="text-[var(--secondary-text)] text-[1rem] leading-[1.6]">{description}</p>
    </div>
);


const Services: React.FC = () => {
    const { t } = useI18n();
    const servicesData = t('services.items');
    
    const icons: { [key: string]: React.ReactNode } = {
        'Création & Refonte': <DesignIcon className="w-8 h-8" />,
        'Creation & Redesign': <DesignIcon className="w-8 h-8" />,
        'Référencement SEO': <SeoIcon className="w-8 h-8" />,
        'SEO Optimization': <SeoIcon className="w-8 h-8" />,
        'Maintenance & Sécurité': <MaintenanceIcon className="w-8 h-8" />,
        'Maintenance & Security': <MaintenanceIcon className="w-8 h-8" />
    };

    return (
        <section className="bg-[var(--surface-background)]">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-[2.441rem] font-bold text-[var(--primary-text)] mb-2 leading-[1.2]">{t('services.title')}</h2>
                <div className="w-24 h-1 bg-[var(--interactive-blue)] mx-auto mb-12"></div>
                <div className="grid md:grid-cols-3 gap-10">
                    {servicesData.map((service: any, index: number) => (
                        <ServiceCard key={index} icon={icons[service.title]} title={service.title} description={service.description} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;