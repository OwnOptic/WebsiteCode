import { useMemo } from 'react';
import { useI18n } from '../i18n/useI18n';

export interface SearchResult {
    type: 'Project' | 'Use Case' | 'Tech Stack';
    title: string;
    description: string;
    path: string;
}

export const useSearch = () => {
    const { t, language } = useI18n();

    const searchIndex = useMemo(() => {
        console.log('Building search index for language:', language);
        const index: SearchResult[] = [];

        // Index Projects
        const projects = t('projects.items') || [];
        projects.forEach((p: any) => {
            index.push({
                type: 'Project',
                title: p.title,
                description: p.description,
                path: p.link
            });
        });

        // Index Use Cases
        const useCases = t('useCases.catalogue') || [];
        useCases.forEach((uc: any) => {
            index.push({
                type: 'Use Case',
                title: uc.title,
                description: uc.miniDescription,
                path: `#/use-cases#uc${uc.id.toString().padStart(2, '0')}`
            });
        });
        
        // Index Tech Stack
        const techStack = t('techStack.categories') || [];
        techStack.forEach((category: any) => {
            category.items.forEach((item: any) => {
                index.push({
                    type: 'Tech Stack',
                    title: item.name,
                    description: item.description,
                    path: '#/tech-stack'
                });
            });
        });

        return index;
    }, [language, t]);

    const search = (query: string): SearchResult[] => {
        if (!query.trim()) {
            return [];
        }

        const lowerCaseQuery = query.toLowerCase();
        
        return searchIndex.filter(item => 
            item.title.toLowerCase().includes(lowerCaseQuery) ||
            item.description.toLowerCase().includes(lowerCaseQuery)
        );
    };

    return { search };
};
