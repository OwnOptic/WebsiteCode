import React from 'react';
import BlogList from '../components/BlogList';
import type { BreadcrumbLink } from '../types';

interface BlogPageProps {
    breadcrumbs: BreadcrumbLink[];
}

const BlogPage: React.FC<BlogPageProps> = ({ breadcrumbs }) => {
    return (
        <BlogList breadcrumbs={breadcrumbs} />
    );
};

export default BlogPage;