import React from 'react';
import '../styles/GitHubCard.css';

const getLanguageColor = (language: string | undefined) => {
  if (!language) return '#ccc';
  switch (language) {
    case 'JavaScript': return '#f1e05a';
    case 'Python': return '#3572A5';
    case 'HTML': return '#e34c26';
    case 'CSS': return '#563d7c';
    case 'TypeScript': return '#3178c6';
    case 'Java': return '#b07219';
    case 'C#': return '#178600';
    case 'C++': return '#f34b7d';
    case 'Go': return '#00ADD8';
    case 'Ruby': return '#701516';
    case 'Swift': return '#ffac45';
    case 'PHP': return '#4F5D95';
    default: return '#ccc';
  }
};

interface GitHubRepoCardProps {
    repoName: string;
    description: string;
    stars: string;
    forks: string;
    language?: string;
    repoUrl: string;
}

const GitHubRepoCard: React.FC<GitHubRepoCardProps> = ({ repoName, description, stars, forks, language, repoUrl }) => {
  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="github-repo-card"
      aria-label={`View ${repoName} on GitHub`}
    >
      <div className="github-repo-card__header">
        <h3 className="github-repo-card__name">
          <svg className="github-repo-card__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          {repoName}
        </h3>
        <div className="github-repo-card__stars">
          <svg className="github-repo-card__star-icon" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <span>{stars}</span>
        </div>
      </div>

      <p className="github-repo-card__description">
        {description}
      </p>

      <div className="github-repo-card__footer">
        {language && (
          <div className="github-repo-card__language">
            <span className="github-repo-card__language-dot" style={{ backgroundColor: getLanguageColor(language) }}></span>
            {language}
          </div>
        )}
        <div className="github-repo-card__forks">
          <svg className="github-repo-card__fork-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v2.586a1 1 0 00.293.707l2 2a1 1 0 001.414 0l2-2A1 1 0 0015 5.586V3a1 1 0 00-1-1H6a1 1 0 00-1 1v2.586a1 1 0 00.293.707l2 2a1 1 0 001.414 0l2-2a1 1 0 00.293-.707V3a1 1 0 00-1-1zm-6 8a2 2 0 100 4h12a2 2 0 100-4H4z" clipRule="evenodd"></path>
          </svg>
          {forks}
        </div>
      </div>
    </a>
  );
};

export default GitHubRepoCard;