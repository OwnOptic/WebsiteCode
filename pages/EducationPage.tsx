import React from 'react';
import Education from '../components/Education';
import type { BreadcrumbLink } from '../types';

interface EducationPageProps {
    breadcrumbs: BreadcrumbLink[];
}

const EducationPage: React.FC<EducationPageProps> = ({ breadcrumbs }) => {
    return (
        <Education breadcrumbs={breadcrumbs} />
    );
};

export default EducationPage;