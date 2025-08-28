import React from 'react';
import OpenSource from '../components/OpenSource';
import type { BreadcrumbLink } from '../types';

interface OpenSourcePageProps {
    breadcrumbs: BreadcrumbLink[];
}

const OpenSourcePage: React.FC<OpenSourcePageProps> = ({ breadcrumbs }) => {
    return (
        <OpenSource breadcrumbs={breadcrumbs} />
    );
};

export default OpenSourcePage;