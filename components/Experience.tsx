import React from 'react';
import { useI18n } from '../i18n/useI18n';
import Breadcrumb from './Breadcrumb';
import type { BreadcrumbLink } from '../types';
import HeroV2 from './HeroV2';
import Timeline from './Timeline';
import '../styles/AboutSubpage.css';

interface ExperienceProps {
    breadcrumbs: BreadcrumbLink[];
}

const Experience: React.FC<ExperienceProps> = ({ breadcrumbs }) => {
    const { t } = useI18n();
    const experienceData = t('experience');

    if (!experienceData || !experienceData.heroV2 || !experienceData.header) return null;
    
    const { header, heroV2, timeline } = experienceData;

    const timelineItems = (timeline || []).map((item: any) => ({
        title: item.role,
        subtitle: item.company,
        period: item.period,
        description: item.points,
        imageUrl: item.imageUrl,
    }));

    return (
        <div>
            <HeroV2 
                variant="full-centered-gradient"
                imageUrl={heroV2.imageUrl}
                title={header.title}
                subtitle={header.subtitle}
            />
            
            <main className="subpage-main-container">
                <Breadcrumb links={breadcrumbs} />
                <Timeline items={timelineItems} />
            </main>
        </div>
    );
};

export default Experience;