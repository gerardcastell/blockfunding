import { useEffect, useState } from 'react';
import Web3 from 'web3';
import './App.css';
import { IAccount } from './components/IAccount';
import TransactionForm from './components/TransactionForm';
declare global {
  interface Window {
    web3: Web3;
    ethereum: any;
  }
}
function App() {
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [ethEnabled, setEthEnabled] = useState(false);
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
  useEffect(() => {
    setAccounts([]);
    fetchData();
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      window.ethereum.enable();
      setEthEnabled(true);
    } else {
      setEthEnabled(false);
    }
    if (!ethEnabled) {
      alert('Please install MetaMask to use this dApp!');
    }
  }, []);

  async function fetchData(): Promise<void> {
    const accountNumbers = await web3.eth.getAccounts();
    for (const accountNumber of accountNumbers) {
      const balance = await web3.eth.getBalance(accountNumber);
      setAccounts((accounts) => [
        ...accounts,
        { address: accountNumber, balance },
      ]);
    }
  }

  return (
    <div className='App'>
      {accounts.map((acc, idx) => (
        <p key='idx'>acc</p>
      ))}
      <header className='App-header'>
        <TransactionForm web3={web3} accounts={accounts} />
      </header>
    </div>
  );
}

export default App;
