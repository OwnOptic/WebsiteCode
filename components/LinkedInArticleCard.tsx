import React from 'react';
import '../styles/LinkedInArticleCard.css';

interface LinkedInArticleCardProps {
  title: string;
  author: string;
  readTime: string;
  publishDate: string;
  summary: string;
  articleUrl: string;
  tags: string[];
}

const LinkedInArticleCard: React.FC<LinkedInArticleCardProps> = ({ title, author, readTime, publishDate, summary, articleUrl, tags }) => {
  return (
    <a
      href={articleUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="linkedin-card"
      aria-label={`Read LinkedIn article: ${title} by ${author}`}
    >
      <div className="linkedin-card-header">
        <svg className="linkedin-card-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72c0-.95-.79-1.72-1.77-1.72zM7.34 20.47H3.59V9.01h3.75v11.46zM5.46 7.42c-1.2 0-2.18-.95-2.18-2.12s.98-2.12 2.18-2.12c1.21 0 2.18.95 2.18 2.12s-.97 2.12-2.18 2.12zM20.47 20.47h-3.74v-5.96c0-1.42-.51-2.38-1.77-2.38-1.33 0-2.12.91-2.12 2.38v5.96h-3.75s.05-10.45 0-11.46h3.75v1.61c.47-.85 1.15-1.54 2.12-1.54 2.37 0 4.14 1.54 4.14 4.88v6.49z"/>
        </svg>
        <div>
          <h3 className="linkedin-card-title">
            {title}
          </h3>
          <p className="linkedin-card-meta">
            By <span className="font-semibold">{author}</span> &bull; {publishDate}
          </p>
        </div>
      </div>

      <div className="linkedin-card-tags">
        {tags.map(tag => (
            <span key={tag} className="linkedin-card-tag">{tag}</span>
        ))}
      </div>

      <p className="linkedin-card-summary">
        {summary}
      </p>

      <div className="linkedin-card-footer">
        <div className="linkedin-card-read-time">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {readTime} read
        </div>
        <span className="linkedin-card-read-more">
          Read Article &rarr;
        </span>
      </div>
    </a>
  );
};

export default LinkedInArticleCard;