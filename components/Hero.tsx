import React from 'react';
import { useI18n } from '../i18n/useI18n';

const Hero: React.FC = () => {
    const { t } = useI18n();
    return (
        <section className="relative h-screen flex items-center justify-center text-white bg-cover bg-center" style={{ backgroundImage: "url('https://raw.githubusercontent.com/OwnOptic/Website-storage/main/Subtle%20Neural%20Web.309Z.png')" }}>
            <div className="absolute inset-0 bg-black opacity-60"></div>
            <div className="relative z-10 text-center px-4 max-w-4xl">
                 <h1 className="text-[3.052rem] md:text-7xl font-bold text-white leading-[1.1] mb-6">{t('hero.name')}</h1>
                <p className="p-lead text-xl md:text-2xl text-gray-200">
                    {t('hero.subtitle')}
                </p>
            </div>
        </section>
    );
};

export default Hero;