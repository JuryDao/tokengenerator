// src/App.js
import React from 'react';
// Update the import statement to import named components
import { NFTMinter, MainFrame, ConnectingWallet } from './components/ConWal.jsx';

function App() {
  return (
    <div className="App">
      <NFTMinter />
      {/* You can use MainFrame and ConnectingWallet components as needed */}
      <MainFrame />
      <ConnectingWallet />
    </div>
  );
}

export default App;
