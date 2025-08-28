import React from 'react';
import About from '../components/About';
import type { BreadcrumbLink } from '../types';

interface AboutPageProps {
    breadcrumbs: BreadcrumbLink[];
}

const AboutPage: React.FC<AboutPageProps> = ({ breadcrumbs }) => {
    return (
        <About breadcrumbs={breadcrumbs} />
    );
};

export default AboutPage;