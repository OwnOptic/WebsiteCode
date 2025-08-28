import React from 'react';
import { useI18n } from '../i18n/useI18n';
import Breadcrumb from './Breadcrumb';
import type { BreadcrumbLink } from '../types';
import HeroV2 from './HeroV2';
import Timeline from './Timeline';
import '../styles/AboutSubpage.css';

interface EducationProps {
    breadcrumbs: BreadcrumbLink[];
}

const Education: React.FC<EducationProps> = ({ breadcrumbs }) => {
    const { t } = useI18n();
    const educationData = t('education');
    
    if (!educationData || !educationData.heroV2 || !educationData.header) return null;

    const { header, heroV2, timeline, cta } = educationData;

    const timelineItems = (timeline || []).map((item: any) => ({
        title: item.degree,
        subtitle: item.institution,
        period: item.period,
        description: item.points,
        imageUrl: item.imageUrl,
    }));
    
    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        window.location.hash = path;
    };

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

                {cta && cta.href && (
                    <div className="subpage-cta-container">
                        <a href={cta.href} onClick={(e) => handleNav(e, cta.href)} className="subpage-cta-button">
                            {cta.text}
                        </a>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Education;