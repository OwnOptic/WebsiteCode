import React from 'react';
import Experience from '../components/Experience';
import type { BreadcrumbLink } from '../types';

interface ExperiencePageProps {
    breadcrumbs: BreadcrumbLink[];
}

const ExperiencePage: React.FC<ExperiencePageProps> = ({ breadcrumbs }) => {
    return (
        <Experience breadcrumbs={breadcrumbs} />
    );
};

export default ExperiencePage;