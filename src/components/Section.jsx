import React from 'react';

const Section = ({ title, children }) => {
    return (
        <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
                color: 'var(--text-color)',
                borderBottom: '1px solid var(--dim-text)',
                paddingBottom: '0.5rem',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '2px'
            }}>
                {'>'} {title}
            </h2>
            <div style={{ paddingLeft: '1.5rem' }}>
                {children}
            </div>
        </div>
    );
};

export default Section;
