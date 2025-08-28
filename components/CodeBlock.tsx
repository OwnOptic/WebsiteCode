import React from 'react';
import '../styles/CodeBlock.css';

// A simple regex-based syntax highlighter for the demo
const syntaxHighlight = (code: string, language: string) => {
    if (language !== 'typescript' && language !== 'javascript' && language !== 'text') {
        return code;
    }
    
    let highlightedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    if (language === 'text') {
        return highlightedCode;
    }

    return highlightedCode
        .replace(/(import|export|from|const|let|var|new|await|async|function|return|if|else|switch|case|default)/g, '<span class="code-keyword">$1</span>')
        .replace(/(\'|`|\")(.*?)(\'|`|\")/g, '<span class="code-string">$1$2$3</span>')
        .replace(/\b(GoogleGenAI|React|Promise|String|JSON|Object)\b/g, '<span class="code-class">$1</span>')
        .replace(/(\.[a-zA-Z_]\w*)/g, (match) => {
            if (match.match(/^\.\d/)) return match;
            return `.<span class="code-method">${match.substring(1)}</span>`;
        })
        .replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span class="code-comment">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>');
};

interface CodeBlockProps {
    code: string;
    language: string;
    theme?: 'default' | 'window';
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, theme = 'default' }) => {
    const highlightedCode = syntaxHighlight(code, language);

    if (theme === 'window') {
        return (
            <div className="code-window">
                <div className="window-header">
                    <div className="window-controls">
                        <div className="control-dot dot-red"></div>
                        <div className="control-dot dot-yellow"></div>
                        <div className="control-dot dot-green"></div>
                    </div>
                </div>
                <pre>
                    <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                </pre>
            </div>
        );
    }
    
    return (
        <pre>
            <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </pre>
    );
};

export default CodeBlock;