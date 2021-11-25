import { useEffect, useState } from "react";
import Web3 from 'web3';
import './App.css';
import { IAccount } from './components/IAccount';
import TransactionForm from './components/TransactionForm';

function App() {

  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

  useEffect(() => {
    setAccounts([]);
    fetchData();
  }, []);


  async function fetchData(): Promise<void> {
    const accountNumbers = await web3.eth.getAccounts();
    for (const accountNumber of accountNumbers) {
      const balance = await web3.eth.getBalance(accountNumber);
      setAccounts(accounts => [...accounts, { address: accountNumber, balance}])
    };
  };

  return (
    <div className="App">
      <header className="App-header">
        <TransactionForm web3={web3} accounts={accounts}/>
      </header>
    </div>

  );
}

export default App;
