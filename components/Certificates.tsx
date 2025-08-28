import React from 'react';
import { useI18n } from '../i18n/useI18n';
import Breadcrumb from './Breadcrumb';
import type { BreadcrumbLink } from '../types';
import HeroV2 from './HeroV2';
import CertificateList from './CertificateList';
import '../styles/AboutSubpage.css';

interface CertificatesProps {
    breadcrumbs: BreadcrumbLink[];
}

const Certificates: React.FC<CertificatesProps> = ({ breadcrumbs }) => {
    const { t } = useI18n();
    const certificatesData = t('certificates');

    if (!certificatesData || !certificatesData.heroV2 || !certificatesData.header) return null;
    
    const { header, heroV2, timeline } = certificatesData;

    return (
        <div>
            <HeroV2 
                variant="full-centered-gradient"
                imageUrl={heroV2.imageUrl}
                title={header.title}
                subtitle={header.subtitle}
            />
            
            <main className="subpage-main-container">
                <Breadcrumb links={breadcrumbs} />
                <CertificateList categories={timeline || []} />
            </main>
        </div>
    );
};

export default Certificates;