import React from 'react';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';

interface FeatureComparisonTableProps {
    headers: string[];
    rows: {
        feature: string;
        values: (boolean | string)[];
    }[];
}

const FeatureComparisonTable: React.FC<FeatureComparisonTableProps> = ({ headers, rows }) => (
    <div className="feature-table">
        <div className="feature-table-header">
            <div>{headers[0]}</div>
            <div className="header-col-2">{headers[1]}</div>
            <div className="header-col-3">{headers[2]}</div>
        </div>
        <div className="feature-table-body">
            {rows.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                    <div className="feature-name">{row.feature}</div>
                    {row.values.map((value, valueIndex) => (
                        <div key={valueIndex} className={`feature-value col-${valueIndex + 2}`}>
                            {typeof value === 'boolean' ? (
                                value ? <CheckIcon className="h-6 w-6 text-green-500" /> : <XIcon className="h-6 w-6 text-red-500" />
                            ) : (
                                value
                            )}
                        </div>
                    ))}
                </React.Fragment>
            ))}
        </div>
    </div>
);

export default FeatureComparisonTable;
