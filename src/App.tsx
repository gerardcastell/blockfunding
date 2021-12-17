import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Web3 from 'web3';
import './App.css';
import Header from './components/shared/Header';
import { fetchAccounts } from './utils/fetchAccounts';
import ProjectsList from './routes/ProjectsList';
import Donation from './routes/Donation';
import Project from './routes/Project';
import { Container } from '@mui/material';

declare global {
  interface Window {
    web3: Web3;
    ethereum: any;
  }
}

export default function App() {
  const [metaMaskAccount, setMetaMaskAccount] = useState<string>('');

  useEffect(() => {
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      window.ethereum.enable();
      getAccounts();
      window.ethereum.on('accountsChanged', function (accounts: any) {
        setMetaMaskAccount(accounts[0]);
      });
    } else {
      alert('Please install MetaMask to use this dApp!');
    }
  }, []);

  const getAccounts = async () => {
    // const accountNumbers = await window.web3.eth.getAccounts();
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    const newAccount = accounts[0];
    setMetaMaskAccount(newAccount);
  };

  return (
    <>
      <BrowserRouter>
        <Header />
        <Container maxWidth='lg'>
          <Routes>
            <Route path='/' element={<ProjectsList />} />
            <Route
              path='/create'
              element={<Project userAccount={metaMaskAccount} />}
            />
            <Route
              path='/:id/donate'
              element={<Donation userAccount={metaMaskAccount} />}
            />
          </Routes>
        </Container>
      </BrowserRouter>
    </>
  );
}
