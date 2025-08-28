import React from 'react';
import Contact from '../components/Contact';
import type { BreadcrumbLink } from '../types';

interface ContactPageProps {
    breadcrumbs: BreadcrumbLink[];
}

const ContactPage: React.FC<ContactPageProps> = ({ breadcrumbs }) => {
    return (
        <div className="py-24 md:py-36">
            <Contact breadcrumbs={breadcrumbs} />
        </div>
    );
};

export default ContactPage;