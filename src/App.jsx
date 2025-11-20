import React from 'react';
import Terminal from './components/Terminal';
import TerminalWindow from './components/TerminalWindow';

function App() {
  return (
    <TerminalWindow>
      <Terminal />
    </TerminalWindow>
  );
}

export default App;
