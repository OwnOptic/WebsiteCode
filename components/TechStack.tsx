import React from 'react';
import { useI18n } from '../i18n/useI18n';
import PlatformIcon from './icons/PlatformIcon';
import CloudIcon from './icons/CloudIcon';
import DevToolsIcon from './icons/DevToolsIcon';

const iconMap: { [key: string]: React.ReactNode } = {
    'PlatformIcon': <PlatformIcon className="w-8 h-8" />,
    'CloudIcon': <CloudIcon className="w-8 h-8" />,
    'DevToolsIcon': <DevToolsIcon className="w-8 h-8" />
};

const TechStack: React.FC = () => {
    const { t } = useI18n();
    const headerData = t('techStack.header');
    const categories = t('techStack.categories') || [];

    const headerStyle = {
        backgroundImage: `url('https://raw.githubusercontent.com/OwnOptic/Website-storage/main/The%20Digital%20Conductor.881Z.png')`
    };

    return (
        <div className="bg-[var(--surface-background)] min-h-screen">
            <header className="relative h-[45vh] min-h-[350px] flex items-center justify-center text-center text-white">
                <div className="absolute inset-0 bg-cover bg-center brightness-50" style={headerStyle}></div>
                <div className="relative z-10 p-4">
                    <h1 className="text-4xl md:text-6xl font-bold">{headerData.title}</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-200">{headerData.subtitle}</p>
                </div>
            </header>
            
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="space-y-16">
                    {categories.map((category: any, index: number) => (
                        <section key={index}>
                            <div className="flex items-center mb-8">
                                <div className="bg-white p-4 rounded-full shadow-md mr-4 text-[var(--interactive-blue)]">
                                    {iconMap[category.icon]}
                                </div>
                                <h2 className="text-3xl font-bold text-[var(--primary-text)]">{category.title}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {category.items.map((item: any, itemIndex: number) => (
                                    <div key={itemIndex} className="bg-white p-6 rounded-lg custom-shadow transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                        <h3 className="text-xl font-semibold text-[var(--primary-text)] mb-2">{item.name}</h3>
                                        <p className="text-[var(--secondary-text)] leading-relaxed">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default TechStack;