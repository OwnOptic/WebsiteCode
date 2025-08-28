import React, { useState, useEffect, useRef } from 'react';
import SearchIcon from './icons/SearchIcon';
import XMarkIcon from './icons/XMarkIcon';
import { useSearch, SearchResult } from '../hooks/useSearch';
import '../styles/SearchModal.css';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const highlightQuery = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <span key={i} className="search-highlight">{part}</span>
                ) : (
                    part
                )
            )}
        </>
    );
};

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const { search } = useSearch();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose();
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        } else {
            // Reset state on close
            setQuery('');
            setResults([]);
        }
    }, [isOpen, onClose]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (query.length > 1) {
                setResults(search(query));
            } else {
                setResults([]);
            }
        }, 200); // Debounce search

        return () => {
            clearTimeout(handler);
        };
    }, [query, search]);
    
    const handleResultClick = (path: string) => {
        window.location.hash = path;
        onClose();
    };


    if (!isOpen) return null;

    return (
        <div className="search-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="search-modal-title">
            <div className="search-modal-content" onClick={e => e.stopPropagation()}>
                <form onSubmit={(e) => e.preventDefault()} className="search-modal-form">
                    <label htmlFor="site-search" id="search-modal-title" className="sr-only">Search the site</label>
                    <div className="search-modal-input-wrapper">
                        <SearchIcon className="search-modal-input-icon" />
                        <input
                            ref={inputRef}
                            id="site-search"
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search projects, use cases, and more..."
                            className="search-modal-input"
                            autoComplete="off"
                        />
                         <button type="button" onClick={onClose} className="search-modal-close-button" aria-label="Close search">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                </form>
                
                {query.length > 1 && (
                     <div className="search-results-container">
                        {results.length > 0 ? (
                            <ul className="search-results-list">
                                {results.slice(0, 10).map((result, index) => (
                                    <li key={index} className="search-result-item">
                                        <a href={result.path} onClick={(e) => { e.preventDefault(); handleResultClick(result.path); }}>
                                            <p className={`search-result-category ${result.type.replace(/\s+/g, '-').toLowerCase()}`}>
                                                {result.type}
                                            </p>
                                            <h4 className="search-result-title">{highlightQuery(result.title, query)}</h4>
                                            <p className="search-result-description">{highlightQuery(result.description, query)}</p>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="search-no-results">
                                <p>No results found for "{query}"</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchModal;
