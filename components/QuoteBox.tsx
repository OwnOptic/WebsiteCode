import React from 'react';
import '../styles/QuoteBox.css';

interface QuoteBoxProps {
    text: string;
    author: string;
    source?: string;
}

const QuoteBox: React.FC<QuoteBoxProps> = ({ text, author, source }) => {
  return (
    <blockquote className="quote-component-wrapper">
      <svg className="quote-svg-top" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
      </svg>
      <svg className="quote-svg-bottom" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
      </svg>
      
      <p className="quote-component-text">
        &ldquo;{text}&rdquo;
      </p>

      <cite className="quote-component-attribution">
        <p className="quote-component-author">{author}</p>
        {source && (
          <p className="quote-component-source">{source}</p>
        )}
      </cite>
    </blockquote>
  );
};

export default QuoteBox;