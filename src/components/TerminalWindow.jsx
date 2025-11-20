import React from 'react';

const TerminalWindow = ({ children }) => {
    return (
        <div style={{
            width: '90vw',
            height: '80vh',
            backgroundColor: '#0d1117',
            borderRadius: '10px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            border: '1px solid #30363d',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Window Header */}
            <div style={{
                backgroundColor: '#161b22',
                padding: '10px 15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid #30363d',
                gap: '8px',
                position: 'relative'
            }}>
                {/* Window Controls */}
                <div style={{ position: 'absolute', left: '15px', display: 'flex', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }}></div>
                </div>

                {/* Title (Optional) */}
                <div style={{
                    color: '#8b949e',
                    fontSize: '0.8rem',
                    fontFamily: 'sans-serif',
                    userSelect: 'none'
                }}>
                    0xaari@portfolio
                </div>
            </div>

            {/* Terminal Content Area */}
            <div style={{
                padding: '20px',
                overflowY: 'auto',
                flex: 1,
                fontFamily: "'Courier New', Courier, monospace",
            }}>
                {children}
            </div>
        </div>
    );
};

export default TerminalWindow;
