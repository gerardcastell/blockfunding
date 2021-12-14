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
  const [userAccounts, setUserAccounts] = useState<IAccount[]>([]);

  useEffect(() => {
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      window.ethereum.enable();
      fetchData(window.web3, setUserAccounts);
    } else {
      alert('Please install MetaMask to use this dApp!');
    }
  }, []);

  async function fetchData(
    web3: Web3,
    setter: React.Dispatch<React.SetStateAction<IAccount[]>>
  ): Promise<void> {
    const accountNumbers = await web3.eth.getAccounts();
    await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    setter(() => []); // TODO: REMOVE THIS (used to not accumulate accounts when developing)
    for (const accountNumber of accountNumbers) {
      const balance = await web3.eth.getBalance(accountNumber);
      setter((accounts) => [...accounts, { address: accountNumber, balance }]);
    }
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <TransactionForm metaMaskAccount={userAccounts[0]}/>
      </header>
    </div>
  );
}

export default App;
