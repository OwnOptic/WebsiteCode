import React, { useState } from 'react';

const ConflictCheckDemo: React.FC = () => {
    const [clientName, setClientName] = useState('Global Innovations Inc.');
    const [parties, setParties] = useState('Tech Solutions LLC, Future Dynamics');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleCheck = () => {
        setIsLoading(true);
        setResult(null);
        setTimeout(() => {
            if (clientName.toLowerCase().includes('global') && parties.toLowerCase().includes('tech')) {
                setResult(JSON.stringify({
                    status: 'Potential Conflict Found',
                    reason: "Global Innovations Inc. was an adverse party to Tech Solutions LLC in the 'IPR-2023-A7' case.",
                    confidence: 0.92,
                    recommendation: 'Requires manual review by the compliance team.'
                }, null, 2));
            } else {
                setResult(JSON.stringify({
                    status: 'No Conflicts Found',
                    reason: 'No direct or indirect adverse relationships found in our internal case management system and public legal databases.',
                    confidence: 0.99,
                    recommendation: 'Proceed with engagement.'
                }, null, 2));
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="space-y-4">
            <p className="text-sm text-[var(--secondary-text)]">This is a mock demonstration. Enter the parties and click 'Run Check' to simulate how an AI would analyze internal and external data to identify potential client conflicts.</p>
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label htmlFor="client-name" className="block text-sm font-medium text-[var(--primary-text)] mb-1">New Client Name</label>
                    <input
                        id="client-name"
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--interactive-blue)]"
                    />
                </div>
                <div>
                    <label htmlFor="involved-parties" className="block text-sm font-medium text-[var(--primary-text)] mb-1">Other Involved Parties (comma-separated)</label>
                    <input
                        id="involved-parties"
                        type="text"
                        value={parties}
                        onChange={(e) => setParties(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--interactive-blue)]"
                    />
                </div>
            </div>
             <button 
                onClick={handleCheck} 
                disabled={isLoading}
                className="w-full bg-[var(--interactive-blue)] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[var(--interactive-hover)] disabled:bg-gray-400 transition-colors flex items-center justify-center"
            >
                 {isLoading && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {isLoading ? 'Analyzing...' : 'Run Conflict Check'}
            </button>
            <div className="bg-[var(--surface-background)] p-4 rounded-lg min-h-[150px]">
                <h5 className="font-semibold text-[var(--primary-text)] mb-2">Analysis Result</h5>
                {isLoading && <p className="text-sm text-[var(--secondary-text)]">Running AI analysis...</p>}
                {result && (
                    <pre className="text-sm text-gray-800 bg-white p-3 rounded overflow-auto font-mono max-h-72">{result}</pre>
                )}
                 {!isLoading && !result && (
                     <p className="text-sm text-[var(--secondary-text)]">JSON output will appear here.</p>
                 )}
            </div>
        </div>
    );
};

export default ConflictCheckDemo;
