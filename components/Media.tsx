import React from 'react';
import { useI18n } from '../i18n/useI18n';
import NewspaperIcon from './icons/NewspaperIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';
import PresentationIcon from './icons/PresentationIcon';

const Media: React.FC = () => {
    const { t } = useI18n();
    const headerData = t('media.header');
    const publications = t('media.publications');
    const podcasts = t('media.podcasts');
    const speaking = t('media.speaking');

    const headerStyle = {
        backgroundImage: `url('https://res.cloudinary.com/dapoc7ekn/image/upload/v1756108979/The_Seamless_Integration.657Z_wosybg.png')`
    };
    
    const Section: React.FC<{ title: string; items: any[]; icon: React.ReactNode }> = ({ title, items, icon }) => (
        <section className="mb-16">
            <div className="flex items-center mb-8">
                <div className="bg-[var(--interactive-blue)] text-white p-3 rounded-full mr-4">
                    {icon}
                </div>
                <h2 className="text-3xl font-bold text-[var(--primary-text)]">{title}</h2>
            </div>
            <div className="space-y-8">
                {items.map((item: any, index: number) => (
                    <div key={index} className="bg-white p-6 rounded-lg custom-shadow transition-shadow duration-300 hover:shadow-xl">
                        <p className="text-sm text-[var(--secondary-text)] mb-1">{item.outlet} &bull; {item.date}</p>
                        <h3 className="text-xl font-semibold text-[var(--primary-text)] mb-2">{item.title}</h3>
                        <p className="text-[var(--secondary-text)] mb-4">{item.description}</p>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--interactive-blue)] hover:text-[var(--interactive-hover)] transition-colors">
                            {t('media.learnMore')} &rarr;
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );

    return (
        <div className="bg-[var(--surface-background)]">
            <header className="relative h-[45vh] min-h-[350px] flex items-center justify-center text-center text-white">
                <div className="absolute inset-0 bg-cover bg-center" style={headerStyle}></div>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 p-4">
                    {headerData && (
                        <>
                            <h1 className="text-4xl md:text-5xl font-bold">{headerData.title}</h1>
                            <p className="mt-4 text-lg max-w-2xl mx-auto">{headerData.subtitle}</p>
                        </>
                    )}
                </div>
            </header>
            
            <main className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                 {publications && publications.items && publications.items.length > 0 && (
                    <Section title={publications.title} items={publications.items} icon={<NewspaperIcon className="w-6 h-6" />} />
                )}
                {podcasts && podcasts.items && podcasts.items.length > 0 && (
                    <Section title={podcasts.title} items={podcasts.items} icon={<MicrophoneIcon className="w-6 h-6" />} />
                )}
                {speaking && speaking.items && speaking.items.length > 0 && (
                    <Section title={speaking.title} items={speaking.items} icon={<PresentationIcon className="w-6 h-6" />} />
                )}
            </main>
        </div>
    );
};

export default Media;
