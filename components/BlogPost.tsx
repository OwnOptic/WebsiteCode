import React, { useEffect, useMemo } from 'react';
import { useI18n } from '../i18n/useI18n';
import * as analytics from '../analytics';

interface Post {
    slug: string;
    title: string;
    author: string;
    publishDate: string;
    readTime: string;
    imageUrl: string;
    summary: string;
    content?: string; // Content is optional
    tags: string[];
    externalUrl: string;
}

const RelatedPostCard: React.FC<{ post: Post }> = ({ post }) => {
    const { t } = useI18n();
     const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        window.location.hash = path;
    };
    return (
        <a href={`#/blog/${post.slug}`} onClick={(e) => handleNav(e, `#/blog/${post.slug}`)} className="block group">
            <div className="bg-white rounded-lg overflow-hidden custom-shadow flex flex-col h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                <img src={post.imageUrl} alt={post.title} className="w-full h-56 object-cover" loading="lazy" />
                <div className="p-4 flex flex-col flex-grow">
                    <h4 className="text-lg font-semibold text-[var(--primary-text)] mb-2 leading-tight flex-grow">{post.title}</h4>
                    <span className="text-sm font-semibold text-[var(--interactive-blue)] group-hover:text-[var(--interactive-hover)] transition-colors self-start mt-2">
                        {t('blog.readMore')} &rarr;
                    </span>
                </div>
            </div>
        </a>
    );
};


const BlogPost: React.FC<{ slug: string }> = ({ slug }) => {
    const { t } = useI18n();
    const posts = (t('blog.posts') || []) as Post[];
    const post = posts.find(p => p.slug === slug);

    useEffect(() => {
        if (post) {
            const pageTitle = `${post.title} | Elliot Margot`;
            // Set document title and meta description for SEO
            document.title = pageTitle;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', post.summary);
            }

            // Update Open Graph and Twitter meta tags
            const baseUrl = 'https://www.e-margot.ch/';
            document.querySelector('meta[property="og:title"]')?.setAttribute('content', pageTitle);
            document.querySelector('meta[property="og:description"]')?.setAttribute('content', post.summary);
            document.querySelector('meta[property="og:image"]')?.setAttribute('content', post.imageUrl);
            document.querySelector('meta[property="og:url"]')?.setAttribute('content', `${baseUrl}${window.location.hash}`);
            document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', pageTitle);
            document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', post.summary);
            document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', post.imageUrl);

            // Track page view for analytics
            analytics.trackPageView(window.location.hash, post.title);
            
            // Track specific event for viewing a blog post
            analytics.trackEvent('view_blog_post', {
                post_slug: post.slug,
                post_title: post.title,
            });
        }
    }, [post]);

    const relatedPosts = useMemo(() => {
        if (!post) return [];
        
        return posts
            .filter(p => p.slug !== post.slug && p.tags.some(tag => post.tags.includes(tag)))
            .sort((a, b) => {
                const aShared = a.tags.filter(tag => post.tags.includes(tag)).length;
                const bShared = b.tags.filter(tag => post.tags.includes(tag)).length;
                return bShared - aShared;
            })
            .slice(0, 3);
    }, [post, posts]);

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        window.location.hash = path;
    };
    
    if (!post) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-center px-4">
                <div>
                    <h1 className="text-4xl font-bold text-[var(--primary-text)] mb-4">Post Not Found</h1>
                    <p className="text-lg text-[var(--secondary-text)]">
                        Sorry, we couldn't find the blog post you were looking for.
                    </p>
                    <a href="#/blog" onClick={(e) => handleNav(e, '#/blog')} className="mt-8 inline-block bg-[var(--interactive-blue)] text-white font-semibold py-3 px-6 rounded-[4px] hover:bg-[var(--interactive-hover)] transition-colors duration-200">
                        {t('blog.backToAll')}
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white">
            <header className="relative h-[50vh] min-h-[400px]">
                <img src={post.imageUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
                    <h1 className="text-3xl md:text-5xl font-bold max-w-4xl">{post.title}</h1>
                    <div className="mt-4 text-lg text-gray-200">
                        <span>By {post.author}</span> &bull; <span>{post.publishDate}</span>
                    </div>
                </div>
            </header>
            
            <main className="py-16">
                <article className="prose lg:prose-xl max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-[var(--secondary-text)]">
                    <style>
                    {`
                    .prose h2, .prose h3, .prose h4 {
                        color: var(--primary-text);
                        margin-bottom: 1.5rem;
                        margin-top: 3rem;
                    }
                     .prose h2 { font-size: 1.875rem; }
                     .prose h3 { font-size: 1.5rem; }
                    .prose p {
                        font-size: 1.125rem;
                        line-height: 1.8;
                        margin-bottom: 1.5rem;
                         color: var(--secondary-text);
                    }
                    .prose strong {
                        color: var(--primary-text);
                    }
                    .prose ol {
                        list-style-type: decimal;
                        margin-left: 1.5rem;
                    }
                     .prose ul {
                        list-style-type: disc;
                        margin-left: 1.5rem;
                    }
                    .prose li {
                         font-size: 1.125rem;
                        line-height: 1.8;
                        margin-bottom: 0.75rem;
                    }
                    `}
                    </style>
                    {post.content ? (
                        <div className="whitespace-pre-wrap font-sans" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                    ) : (
                        <p>{post.summary}</p>
                    )}
                </article>

                {relatedPosts.length > 0 && (
                    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 border-t pt-16">
                         <h2 className="text-3xl font-bold text-center text-[var(--primary-text)] mb-12">{t('blog.relatedPostsTitle')}</h2>
                         <div className="grid md:grid-cols-3 gap-8">
                             {relatedPosts.map(relatedPost => (
                                 <RelatedPostCard key={relatedPost.slug} post={relatedPost} />
                             ))}
                         </div>
                    </section>
                )}

                 <div className="text-center mt-16">
                    <a href="#/blog" onClick={(e) => handleNav(e, '#/blog')} className="inline-block bg-gray-100 text-[var(--primary-text)] font-semibold py-3 px-6 rounded-[4px] hover:bg-gray-200 transition-colors duration-200">
                       {t('blog.backToAll')}
                    </a>
                </div>
            </main>
        </div>
    );
};

export default BlogPost;