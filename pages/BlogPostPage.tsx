import React from 'react';
import BlogPost from '../components/BlogPost';

const BlogPostPage: React.FC<{ slug: string }> = ({ slug }) => {
    return (
        <BlogPost slug={slug} />
    );
};

export default BlogPostPage;