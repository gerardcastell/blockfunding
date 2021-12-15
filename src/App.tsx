import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Web3 from 'web3';
import './App.css';
import Header from './components/shared/Header';
import { IAccount } from './components/shared/IAccount';
import { fetchData } from './routes/AccountsFetch';
import ContractsList from './routes/ContractsList';
import MakeDonation from './routes/MakeDonation';

declare global {
  interface Window {
    web3: Web3;
    ethereum: any;
  }
}

export default function App() {
  const [metaMaskAccounts, setMetaMaskAccounts] = useState<IAccount[]>([]);

  useEffect(() => {
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      window.ethereum.enable();
      fetchData(window.web3, setMetaMaskAccounts);
    } else {
      alert('Please install MetaMask to use this dApp!');
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<ContractsList />} />
          <Route path="about" element={<MakeDonation userAccount={metaMaskAccounts[0]}/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}