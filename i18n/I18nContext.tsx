import React, { createContext, useState, useEffect, ReactNode } from 'react';
import SkeletonLoader from '../components/SkeletonLoader';

type Language = 'en' | 'fr';

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, replacements?: { [key: string]: string }) => any;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

const toCamelCase = (str: string): string => str.replace(/-([a-z])/g, g => g[1].toUpperCase());

const loadAndMergeTranslations = async (lang: Language) => {
    try {
        const uiStringsPath = `/i18n/locales/${lang}.json`;
        const uiResponse = await fetch(uiStringsPath);
        if (!uiResponse.ok) throw new Error(`Failed to load UI strings for ${lang}`);
        const translations = await uiResponse.json();

        const contentPaths = ['about', 'blog', 'certificates', 'contact', 'education', 'experience', 'home', 'projects', 'tech-stack'];
        
        const contentPromises = contentPaths.map(path =>
            fetch(`/i18n/content/${path}.${lang}.json`)
                .then(res => {
                    if (!res.ok) throw new Error(`Failed to load ${path}.${lang}.json`);
                    return res.json();
                })
        );
        
        const allPageContent = await Promise.all(contentPromises);
        
        allPageContent.forEach((content, index) => {
            const pathKey = contentPaths[index];
            const contentRootKey = toCamelCase(pathKey);
            if (pathKey === 'home') {
                Object.assign(translations, content);
            } else {
                 if (!translations[contentRootKey]) {
                    translations[contentRootKey] = {};
                }
                Object.assign(translations[contentRootKey], content[contentRootKey]);
            }
        });

        const useCaseFiles = [
            'cross-industry-solutions', 'financial-services-banking', 'insurance', 
            'manufacturing', 'media-entertainment', 'pharmaceuticals', 
            'professional-services', 'public-sector', 'retail-consumer-packaged-goods', 
            'telecom', 'utilities'
        ];
        const useCasePromises = useCaseFiles.map(file =>
            fetch(`/i18n/content/use-cases/${file}.${lang}.json`)
                .then(res => res.ok ? res.json() : { catalogue: [] })
        );
        const allUseCases = await Promise.all(useCasePromises);
        if (!translations.useCases) translations.useCases = {};
        translations.useCases.catalogue = allUseCases.flatMap(uc => uc.catalogue || []);
        
        // Fetch individual project detail files
        if (translations.projects && translations.projects.items) {
            translations.projects.details = {};
            const projectSlugs = translations.projects.items.map((item: any) => item.slug).filter(Boolean);
            const projectDetailPromises = projectSlugs.map((slug: string) => 
                fetch(`/i18n/content/projects/${slug}.${lang}.json`)
                    .then(res => res.ok ? res.json() : null)
                    .then(data => ({ slug, data }))
            );

            const projectDetails = await Promise.all(projectDetailPromises);
            projectDetails.forEach(({ slug, data }) => {
                if (data) {
                    translations.projects.details[slug] = data;
                }
            });
        }

        return translations;

    } catch (error) {
        console.error("Error loading and merging translations:", error);
        throw error;
    }
};


export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');
    const [translations, setTranslations] = useState<any>({});

    useEffect(() => {
        const loadTranslations = async () => {
            try {
                const data = await loadAndMergeTranslations(language);
                setTranslations(data);
            } catch (error) {
                console.error(error);
                if (language !== 'en') {
                    try {
                        console.log('Falling back to English translations...');
                        const fallbackData = await loadAndMergeTranslations('en');
                        setTranslations(fallbackData);
                        setLanguage('en');
                    } catch (fallbackError) {
                        console.error('Failed to load fallback English translations:', fallbackError);
                        setTranslations({});
                    }
                }
            }
        };
        loadTranslations();
    }, [language]);

    const t = (key: string, replacements?: { [key: string]: string }): any => {
        const keys = key.split('.');
        let result = translations;
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) {
                // Return undefined instead of the key to allow for safe fallbacks (e.g., t('key') || [])
                return undefined;
            }
        }

        if (typeof result === 'string' && replacements) {
            Object.keys(replacements).forEach(placeholder => {
                result = result.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), replacements[placeholder]);
            });
        }

        return result;
    };

    return (
        <I18nContext.Provider value={{ language, setLanguage, t }}>
            {Object.keys(translations).length > 0 ? children : <SkeletonLoader />}
        </I18nContext.Provider>
    );
};