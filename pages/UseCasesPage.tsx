import React from 'react';
import UseCaseCatalogue from '../components/UseCaseCatalogue';
import type { BreadcrumbLink } from '../types';

interface UseCasesPageProps {
    breadcrumbs: BreadcrumbLink[];
}

const UseCasesPage: React.FC<UseCasesPageProps> = ({ breadcrumbs }) => {
    return (
        <div className="py-24 md:py-36">
            <UseCaseCatalogue breadcrumbs={breadcrumbs} />
        </div>
    );
};

export default UseCasesPage;