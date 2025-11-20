import React, { useState, useEffect, useRef } from 'react';
import Section from './Section';
import { content } from '../data/content';

const PROMPT = "user@0xaari.dev %";

const TypingEffect = ({ text, speed = 10, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + text.charAt(index));
            index++;
            if (index >= text.length) {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, speed);
        return () => clearInterval(interval);
    }, [text, speed, onComplete]);

    return <span>{displayedText}</span>;
};

const Terminal = () => {
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState('');
    const [cursorPos, setCursorPos] = useState(0);
    const [showCursor, setShowCursor] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const inputRef = useRef(null);
    const hiddenInputRef = useRef(null);
    const bottomRef = useRef(null);

    // Focus hidden input on click (for mobile keyboard)
    useEffect(() => {
        if (hiddenInputRef.current) hiddenInputRef.current.focus();
    }, [history]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [history, input]);

    // Blink cursor
    useEffect(() => {
        const interval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 530);
        return () => clearInterval(interval);
    }, []);

    // Initial welcome message
    useEffect(() => {
        const welcomeMessage = (
            <div>
                <div style={{ color: '#27c93f', whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: '1.2', marginBottom: '1rem' }}>
                    {`
    _              _
   / \\   __ _ _ __(_)
  / _ \\ / _\` | '__| |
 / ___ \\ (_| | |  | |
/_/   \\_\\__,_|_|  |_| (Aaryansh Sahay)
`}
                </div>
                <p style={{ color: 'var(--dim-text)', marginBottom: '0.5rem' }}>Founding Engineer @ Pally (YCS25)</p>
                <p style={{ color: 'var(--dim-text)', marginBottom: '0.5rem' }}>Hey, I'm Aari (aaryansh) Sahay, I love making game - AIs in my free time. I've made an agentic murder mystery game, self driving cars in GTA, aimbots in CSGO.... I also love the strokes.</p>

                <p style={{ color: 'var(--dim-text)', marginBottom: '1rem' }}>// type <span style={{ color: '#fff' }}>--help</span> for commands</p>
            </div>
        );
        setHistory([{ command: '', output: welcomeMessage }]);
    }, []);

    const handleKeyDown = (e) => {
        if (isTyping) return;

        if (e.key === 'ArrowLeft') {
            setCursorPos((prev) => Math.max(0, prev - 1));
        } else if (e.key === 'ArrowRight') {
            setCursorPos((prev) => Math.min(input.length, prev + 1));
        } else if (e.key === 'Backspace') {
            if (cursorPos > 0) {
                setInput((prev) => prev.slice(0, cursorPos - 1) + prev.slice(cursorPos));
                setCursorPos((prev) => prev - 1);
            }
        } else if (e.key === 'Enter') {
            executeCommand(input);
            setInput('');
            setCursorPos(0);
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            setInput((prev) => prev.slice(0, cursorPos) + e.key + prev.slice(cursorPos));
            setCursorPos((prev) => prev + 1);
        }
    };

    const handleHiddenInputChange = (e) => {
        const value = e.target.value;
        setInput(value);
        setCursorPos(value.length);
    };

    const handleHiddenInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            executeCommand(input);
            setInput('');
            setCursorPos(0);
            if (hiddenInputRef.current) {
                hiddenInputRef.current.value = '';
            }
            e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
            setCursorPos((prev) => Math.max(0, prev - 1));
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            setCursorPos((prev) => Math.min(input.length, prev + 1));
            e.preventDefault();
        } else if (e.key === 'Backspace') {
            if (input.length > 0) {
                const newInput = input.slice(0, -1);
                setInput(newInput);
                setCursorPos(newInput.length);
                if (hiddenInputRef.current) {
                    hiddenInputRef.current.value = newInput;
                }
            }
            e.preventDefault();
        }
    };

    const executeCommand = (cmd) => {
        const trimmedCmd = cmd.trim().toLowerCase();
        let output = null;

        // Helper for welcome message
        const welcomeMessage = (
            <div>

                <div style={{ color: '#27c93f', whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: '1.2', marginBottom: '1rem' }}>
                    {`
    _              _
   / \\   __ _ _ __(_)
  / _ \\ / _\` | '__| |
 / ___ \\ (_| | |  | |
/_/   \\_\\__,_|_|  |_|
`}
                </div>
                <p style={{ color: 'var(--dim-text)', marginBottom: '0.5rem' }}>Founding Engineer @ Pally (YCS25)</p>
                <p style={{ color: 'var(--dim-text)', marginBottom: '1rem' }}>// type <span style={{ color: '#fff' }}>--help</span> for commands</p>
            </div>
        );

        if (trimmedCmd === 'clear' || trimmedCmd === '--clear') {
            setHistory([{ command: '', output: welcomeMessage }]);
            return;
        }

        if (!trimmedCmd.startsWith('--') && trimmedCmd !== '') {
            output = <div>Command must start with '--'. Try <span style={{ color: '#fff' }}>--help</span>.</div>;
            setHistory((prev) => [...prev, { command: cmd, output }]);
            return;
        }

        const cleanCmd = trimmedCmd.substring(2);

        switch (cleanCmd) {
            case 'help':
                output = (
                    <div>
                        <div>Available commands:</div>
                        <div style={{ paddingLeft: '1rem', color: 'var(--dim-text)' }}>
                            <div><span style={{ color: '#fff' }}>--about</span>      - Display experience and education</div>
                            <div><span style={{ color: '#fff' }}>--socials</span>    - List social links</div>
                            <div><span style={{ color: '#fff' }}>--fun</span>        - Show fun facts</div>
                            <div><span style={{ color: '#fff' }}>--clear</span>      - Clear terminal</div>
                        </div>
                    </div>
                );
                break;
            case 'about':
                output = (
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 2, minWidth: '300px' }}>
                            <Section title={content.sections[0].title}>
                                {content.sections[0].items.map((item, index) => (
                                    <div key={index} style={{ marginBottom: '1rem' }}>
                                        <div style={{ fontWeight: 'bold', color: '#fff' }}>{item.role}</div>
                                        <div style={{ color: 'var(--dim-text)' }}>{item.company} | {item.period}</div>
                                        <div style={{ marginTop: '0.25rem' }}>
                                            {Array.isArray(item.description) ? (
                                                <ul style={{ listStyleType: 'square', paddingLeft: '1rem', marginTop: '0.25rem', marginBottom: 0 }}>
                                                    {item.description.map((desc, i) => (
                                                        <li key={i}>{desc}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                item.description
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </Section>
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <Section title={content.sections[1].title}>
                                {content.sections[1].items.map((item, index) => (
                                    <div key={index} style={{ marginBottom: '1rem' }}>
                                        <div style={{ fontWeight: 'bold', color: '#fff' }}>{item.degree}</div>
                                        <div style={{ color: 'var(--dim-text)' }}>{item.school}, {item.year}</div>
                                    </div>
                                ))}
                            </Section>
                        </div>
                    </div>
                );
                break;
            case 'socials':
                output = (
                    <Section title={content.sections[2].title}>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            {content.sections[2].items.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--text-color)', textDecoration: 'none', borderBottom: '1px dashed var(--dim-text)' }}
                                >
                                    [{item.label}]
                                </a>
                            ))}
                        </div>
                    </Section>
                );
                break;
            case 'fun':
                output = (
                    <Section title={content.sections[3].title}>
                        <ul style={{ listStyleType: 'square', paddingLeft: '1rem' }}>
                            {content.sections[3].items.map((item, index) => (
                                <li key={index} style={{ marginBottom: '0.5rem' }}>{item}</li>
                            ))}
                        </ul>
                    </Section>
                );
                break;
            case 'dishi':
                output = (
                    <div style={{ color: '#ff69b4', whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: '1.2' }}>
                        {`
  _____ ___  ____      __  ____   __    ____ ___ ____  _   _ ___ 
 |  ___/ _ \\|  _ \\    |  \\/  \\ \\ / /   |  _ \\_ _/ ___|| | | |_ _|
 | |_ | | | | |_) |   | |\\/| |\\ V /    | | | | |\\___ \\| |_| || | 
 |  _|| |_| |  _ <    | |  | | | |     | |_| | | ___) |  _  || | 
 |_|__ \\___/|_|_\\_\\  _|_| _|_|_|_|_    |____/___|____/|_| |_|___|
 | __ )  / \\  |  _ \\| __ )_ _| ____|                             
 |  _ \\ / _ \\ | |_) |  _ \\ | ||  _|                               
 | |_) / ___ \\|  _ <| |_) | || |___                              
 |____/_/   \\_\\_| \\_\\____/|___|_____|  _____  _   _    _______    
 |_ _| | |   / _ \\ \\   / / ____| \\ \\ / / _ \\| | | |  / /___ /    
  | |  | |  | | | \\ \\ / /|  _|    \\ V / | | | | | | / /  |_ \\    
  | |  | |__| |_| |\\ V / | |___    | || |_| | |_| | \\ \\ ___) |   
 |___| |_____\\___/  \\_/  |_____|   |_| \\___/ \\___/   \\_\\____/
`}
                    </div>
                );
                break;
            case '':
                output = null;
                break;
            default:
                output = <div>Command not found: {cmd}. Type <span style={{ color: '#fff' }}>--help</span> for available commands.</div>;
        }

        setHistory((prev) => [...prev, { command: cmd, output }]);
    };

    return (
        <div
            className="terminal-content"
            onClick={() => {
                if (hiddenInputRef.current) hiddenInputRef.current.focus();
            }}
            style={{ minHeight: '100%', outline: 'none' }}
            ref={inputRef}
        >
            <input
                ref={hiddenInputRef}
                type="text"
                value={input}
                onChange={handleHiddenInputChange}
                onKeyDown={handleHiddenInputKeyDown}
                style={{
                    position: 'absolute',
                    left: '-9999px',
                    opacity: 0,
                    pointerEvents: 'none'
                }}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
            />
            {history.map((entry, index) => (
                <div key={index} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {(!entry.command && entry.output) ? null : <span style={{ color: '#27c93f', marginRight: '0.5rem' }}>{PROMPT}</span>}
                        <span>{entry.command}</span>
                    </div>
                    {entry.output && <div style={{ marginTop: '0.5rem' }}>{entry.output}</div>}
                </div>
            ))}

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#27c93f', marginRight: '0.5rem' }}>{PROMPT}</span>
                <div style={{ position: 'relative', display: 'inline-block', minHeight: '1.2em', minWidth: '1ch' }}>
                    <span>{input}</span>
                    {/* Cursor */}
                    <span style={{
                        position: 'absolute',
                        left: `${cursorPos}ch`,
                        top: 0,
                        backgroundColor: showCursor ? 'var(--text-color)' : 'transparent',
                        color: '#000',
                        width: '1ch',
                        height: '1.2em',
                        opacity: 0.7,
                        pointerEvents: 'none'
                    }}>
                        {input[cursorPos] || ' '}
                    </span>
                </div>
            </div>
            <div ref={bottomRef} />
        </div>
    );
};

export default Terminal;
