import React from 'react';
import '../styles/AuthorBio.css';

interface AuthorBioProps {
    imageUrl: string;
    name: string;
    title: string;
}

const AuthorBio: React.FC<AuthorBioProps> = ({ imageUrl, name, title }) => (
    <div className="author-bio">
        <img className="author-avatar" src={imageUrl} alt={name} />
        <div className="author-details">
            <p className="author-name">{name}</p>
            <p className="author-title">{title}</p>
        </div>
    </div>
);

export default AuthorBio;