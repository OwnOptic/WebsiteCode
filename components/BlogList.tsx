import React, { useState, useMemo } from 'react';
import { useI18n } from '../i18n/useI18n';
import SearchIcon from './icons/SearchIcon';

interface Post {
    slug: string;
    title: string;
    author: string;
    date: string;
    imageUrl: string;
    summary: string;
    tags: string[];
    content: string; // Added for searching
}

const BlogList: React.FC = () => {
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
                post.summary.toLowerCase().includes(lowerCaseQuery) ||
                post.content.toLowerCase().includes(lowerCaseQuery)
            );
        }

        return filtered;
    }, [posts, selectedTag, searchQuery]);

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        window.location.hash = path;
    };

    const headerStyle = {
        backgroundImage: `url('https://raw.githubusercontent.com/OwnOptic/Website-storage/main/The%20Abstract%20Brain%20of%20AI.png')`
    };

    return (
        <div>
            <header className="relative h-[45vh] min-h-[350px] flex items-center justify-center text-center text-white">
                <div className="absolute inset-0 bg-cover bg-center brightness-50" style={headerStyle}></div>
                <div className="relative z-10 p-4">
                    <h1 className="text-4xl md:text-6xl font-bold">{headerData.title}</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-200">{headerData.subtitle}</p>
                </div>
            </header>
            
            <main className="bg-[var(--surface-background)] py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filters Section */}
                    <div className="mb-12 p-6 bg-white rounded-lg custom-shadow">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--primary-text)] mb-3 text-center md:text-left">{t('blog.filterByTag')}</h3>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                    <button
                                        onClick={() => setSelectedTag(null)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${!selectedTag ? 'bg-[var(--interactive-blue)] text-white' : 'bg-gray-100 text-[var(--secondary-text)] hover:bg-gray-200'}`}
                                    >
                                        {t('blog.allTags')}
                                    </button>
                                    {allTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setSelectedTag(tag)}
                                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${selectedTag === tag ? 'bg-[var(--interactive-blue)] text-white' : 'bg-gray-100 text-[var(--secondary-text)] hover:bg-gray-200'}`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                             <div className="relative">
                                <SearchIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('blog.searchPlaceholder')}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-[var(--interactive-blue)] focus:border-[var(--interactive-blue)] transition-shadow"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-16">
                        {filteredPosts.map((post) => (
                            <article key={post.slug} className="group bg-white p-8 rounded-lg custom-shadow transition-shadow duration-300 hover:shadow-xl">
                                <div className="grid md:grid-cols-3 gap-8 items-center">
                                    <div className="md:col-span-1">
                                        <a href={`#/blog/${post.slug}`} onClick={(e) => handleNav(e, `#/blog/${post.slug}`)}>
                                            <img src={post.imageUrl} alt={post.title} className="rounded-md object-cover w-full h-56 transition-transform duration-300 group-hover:scale-105" loading="lazy" width="300" height="224" />
                                        </a>
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {post.tags.map(tag => (
                                                <span key={tag} className="bg-gray-100 text-[var(--secondary-text)] text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
                                            ))}
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-[var(--primary-text)] mb-2">
                                            <a href={`#/blog/${post.slug}`} onClick={(e) => handleNav(e, `#/blog/${post.slug}`)} className="hover:text-[var(--interactive-blue)] transition-colors">
                                                {post.title}
                                            </a>
                                        </h2>
                                        <div className="text-sm text-[var(--secondary-text)] mb-4">
                                            <span>By {post.author}</span> &bull; <span>{post.date}</span>
                                        </div>
                                        <p className="text-[var(--secondary-text)] leading-relaxed mb-6">{post.summary}</p>
                                        <a 
                                            href={`#/blog/${post.slug}`} 
                                            onClick={(e) => handleNav(e, `#/blog/${post.slug}`)} 
                                            className="font-semibold text-[var(--interactive-blue)] hover:text-[var(--interactive-hover)] transition-colors">
                                            {t('blog.readMore')} &rarr;
                                        </a>
                                    </div>
                                </div>
                            </article>
                        ))}
                         {filteredPosts.length === 0 && (
                            <div className="text-center py-16 text-[var(--secondary-text)] bg-white rounded-lg custom-shadow">
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