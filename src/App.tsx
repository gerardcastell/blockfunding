import './App.css';
import Web3 from 'web3';
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  const [accounts, setAccounts] = useState<string[]>([]);
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed', window.ethereum);
  }

  useEffect(() => {
    const web3 = new Web3('http://localhost:8545');

    console.log('On mount');
    async function getAccounts() {
      const accs = await web3.eth.getAccounts();
      setAccounts(accs);
    }
    getAccounts();
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        <h3>Account List:</h3>
        {accounts?.map((acc, idx) => (
          <p style={{ fontSize: '12px' }} key={idx}>
            {acc}
          </p>
        ))}
      </header>
    </div>
  );
}

export default App;
