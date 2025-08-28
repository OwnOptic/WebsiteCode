import React from 'react';
import AnimatedHero from '../components/AnimatedHero';
import IconFeatureList from '../components/IconFeatureList';
import CardGrid from '../components/CardGrid';
import { useI18n } from '../i18n/useI18n';
import GitHubUserCard from '../components/GitHubUserCard';
import type { BreadcrumbLink } from '../types';
import TextImage from '../components/TextImage';

interface HomePageProps {
    breadcrumbs: BreadcrumbLink[];
}

const HomePage: React.FC<HomePageProps> = ({ breadcrumbs }) => {
    const { t } = useI18n();
    const homeData = t('homePage');

    if (!homeData) return null;

    const { animatedHero, expertise, approach, projects, github } = homeData;

    return (
        <>
            <AnimatedHero {...animatedHero} />
            <section>
                <IconFeatureList 
                    title={expertise.title}
                    items={expertise.items}
                    variant="two-columns"
                />
            </section>
            {approach && (
                <TextImage {...approach} />
            )}
             <section>
                <CardGrid 
                    title={projects.title}
                    cards={projects.cards}
                />
            </section>
            {github && (
                <section>
                    <div className="home-github-container">
                        <h2 className="home-github-title">{github.title}</h2>
                        <div className="home-github-divider"></div>
                        <GitHubUserCard {...github.profile} />
                    </div>
                </section>
            )}
        </>
    );
};

export default HomePage;