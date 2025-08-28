import React, { useState, useMemo } from 'react';
import { useI18n } from '../i18n/useI18n';
import SearchIcon from './icons/SearchIcon';
import Breadcrumb from './Breadcrumb';
import type { BreadcrumbLink } from '../types';
import LinkedInArticleCard from './LinkedInArticleCard';
import '../styles/BlogList.css';

interface Post {
    slug: string;
    title: string;
    author: string;
    publishDate: string;
    readTime: string;
    imageUrl: string;
    summary: string;
    tags: string[];
    externalUrl: string;
}

interface BlogListProps {
    breadcrumbs: BreadcrumbLink[];
}

const BlogList: React.FC<BlogListProps> = ({ breadcrumbs }) => {
    const { t } = useI18n();
    const posts = (t('blog.posts') || []) as Post[];
    const headerData = t('blog.header');
    
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const allTags = useMemo(() => {
        const tagsSet = new Set<string>();
        posts.forEach(post => {
            post.tags.forEach(tag => tagsSet.add(tag));
        });
        return Array.from(tagsSet).sort();
    }, [posts]);

    const filteredPosts = useMemo(() => {
        let filtered = posts;

        if (selectedTag) {
            filtered = filtered.filter(post => post.tags.includes(selectedTag));
        }

        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(lowerCaseQuery) ||
                post.summary.toLowerCase().includes(lowerCaseQuery)
            );
        }

        return filtered;
    }, [posts, selectedTag, searchQuery]);

    const headerStyle = {
        backgroundImage: `url('https://res.cloudinary.com/dapoc7ekn/image/upload/v1756109003/The_Abstract_Brain_of_AI_ngzbnq.png')`
    };

    return (
        <div className="blog-list-page">
            <header className="blog-list-header" style={headerStyle}>
                <div className="blog-list-header-overlay"></div>
                <div className="blog-list-header-content">
                    <h1>{headerData?.title}</h1>
                    <p>{headerData?.subtitle}</p>
                </div>
            </header>
            
            <main className="blog-list-main">
                <div className="blog-list-container">
                    <Breadcrumb links={breadcrumbs} />
                    <div className="blog-list-filters-wrapper">
                        <div className="blog-list-filters-grid">
                            <div>
                                <h3 className="blog-list-filters-title">{t('blog.filterByTag')}</h3>
                                <div className="blog-list-tags-container">
                                    <button
                                        onClick={() => setSelectedTag(null)}
                                        className={`filter-tag-button ${!selectedTag ? 'active' : ''}`}
                                    >
                                        {t('blog.allTags')}
                                    </button>
                                    {allTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setSelectedTag(tag)}
                                            className={`filter-tag-button ${selectedTag === tag ? 'active' : ''}`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                             <div className="search-input-wrapper relative">
                                <SearchIcon className="search-input-icon" />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('blog.searchPlaceholder')}
                                    className="search-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="blog-list-grid">
                        {filteredPosts.map((post) => (
                           <LinkedInArticleCard 
                                key={post.slug}
                                title={post.title}
                                author={post.author}
                                readTime={post.readTime}
                                publishDate={post.publishDate}
                                summary={post.summary}
                                articleUrl={post.externalUrl}
                                tags={post.tags}
                           />
                        ))}
                         {filteredPosts.length === 0 && (
                            <div className="blog-list-no-results">
                                <p className="text-xl font-semibold">{t('blog.noResults')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BlogList;