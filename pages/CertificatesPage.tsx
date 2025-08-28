import React from 'react';
import Certificates from '../components/Certificates';
import type { BreadcrumbLink } from '../types';

interface CertificatesPageProps {
    breadcrumbs: BreadcrumbLink[];
}

const CertificatesPage: React.FC<CertificatesPageProps> = ({ breadcrumbs }) => {
    return (
        <Certificates breadcrumbs={breadcrumbs} />
    );
};

export default CertificatesPage;