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

const isObject = (item: any): item is Record<string, any> => {
    return (item && typeof item === 'object' && !Array.isArray(item));
};

const mergeDeep = (target: any, ...sources: any[]): any => {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {} });
                }
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
};


const loadAndMergeTranslations = async (lang: Language) => {
    try {
        const uiStringsPath = `/i18n/locales/${lang}.json`;
        const uiResponse = await fetch(uiStringsPath);
        if (!uiResponse.ok) throw new Error(`Failed to load UI strings for ${lang}`);
        let translations = await uiResponse.json();

        const contentPaths = ['about', 'certificates', 'contact', 'education', 'experience', 'home', 'projects', 'tech-stack', 'open-source', 'not-found'];
        
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

            if (pathKey === 'home' || pathKey === 'not-found') {
                 translations = mergeDeep(translations, content);
            } else {
                const contentToMerge = content[contentRootKey] || content;
                translations[contentRootKey] = mergeDeep(translations[contentRootKey] || {}, contentToMerge);
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
                .then(res => {
                    if (!res.ok) return { catalogue: [] };
                    return res.json().catch(err => {
                        console.error(`Failed to parse JSON for ${file}.${lang}.json`, err);
                        return { catalogue: [] };
                    });
                })
        );
        const allUseCases = await Promise.all(useCasePromises);
        if (!translations.useCases) translations.useCases = {};
        translations.useCases.catalogue = allUseCases.flatMap(uc => uc.catalogue || []);
        
        // Removed pre-fetching of individual project files to fix loading bug and improve performance.
        // Individual project pages now fetch their own content.

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