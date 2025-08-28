import React from 'react';
import TechStack from '../components/TechStack';
import type { BreadcrumbLink } from '../types';

interface TechStackPageProps {
    breadcrumbs: BreadcrumbLink[];
}

const TechStackPage: React.FC<TechStackPageProps> = ({ breadcrumbs }) => {
    return (
        <TechStack breadcrumbs={breadcrumbs} />
    );
};

export default TechStackPage;