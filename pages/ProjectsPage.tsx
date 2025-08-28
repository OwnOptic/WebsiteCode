import React from 'react';
import Projects from '../components/Projects';
import type { BreadcrumbLink } from '../types';

interface ProjectsPageProps {
    breadcrumbs: BreadcrumbLink[];
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ breadcrumbs }) => {
    return (
        <Projects breadcrumbs={breadcrumbs} />
    );
};

export default ProjectsPage;