import React from 'react';
import Hero from '../components/Hero';
import HomeExpertise from '../components/HomeExpertise';
import HomeProjects from '../components/HomeProjects';

const HomePage: React.FC = () => {
    return (
        <>
            <Hero />
            <div className="py-24 md:py-32 bg-[var(--surface-background)]">
                <HomeExpertise />
            </div>
             <div className="py-24 md:py-32">
                <HomeProjects />
            </div>
        </>
    );
};

export default HomePage;