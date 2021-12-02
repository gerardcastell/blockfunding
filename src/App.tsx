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
  const [userAccounts, setUserAccounts] = useState<IAccount[]>([]);

  const ganacheWeb3 = new Web3('http://localhost:8545');

  useEffect(() => {
    fetchData(ganacheWeb3, setAccounts);
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      window.ethereum.enable();
      fetchData(window.web3, setUserAccounts);
      window.ethereum.on('connect', (accounts: any) =>
        console.log('Connect', accounts)
      );
      window.ethereum.on('accountsChanged', (event: any) =>
        console.log('accountsChanged', event)
      );
    } else {
      alert('Please install MetaMask to use this dApp!');
    }
    return () => {
      window.ethereum.removeListener('connect');
      window.ethereum.removeListener('accountsChanged');
    };
  }, []);

  async function fetchData(
    web3: Web3,
    setter: React.Dispatch<React.SetStateAction<IAccount[]>>
  ): Promise<void> {
    const accountNumbers = await web3.eth.getAccounts();
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    console.log('Accounts ethereum', accounts);
    setter(() => []);
    for (const accountNumber of accountNumbers) {
      const balance = await web3.eth.getBalance(accountNumber);
      setter((accounts) => [...accounts, { address: accountNumber, balance }]);
    }
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <TransactionForm
          sendTransaction={ganacheWeb3.eth.sendTransaction}
          accounts={accounts}
          userAccounts={userAccounts}
        />
      </header>
    </div>
  );
}

export default App;
