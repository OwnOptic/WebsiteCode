import React from 'react';
import { useI18n } from '../i18n/useI18n';
import DesignIcon from './icons/DesignIcon';
import SeoIcon from './icons/SeoIcon';
import MaintenanceIcon from './icons/MaintenanceIcon';
import '../styles/Services.css';

interface ServiceCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => (
    <div className="service-card">
        <div className="service-card-icon-wrapper">
            {icon}
        </div>
        <h4 className="service-card-title">{title}</h4>
        <p className="service-card-description">{description}</p>
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
        <section className="services-section">
            <div className="services-container">
                <h2 className="services-title">{t('services.title')}</h2>
                <div className="services-divider"></div>
                <div className="services-grid">
                    {servicesData.map((service: any, index: number) => (
                        <ServiceCard key={index} icon={icons[service.title]} title={service.title} description={service.description} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;