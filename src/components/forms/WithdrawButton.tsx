import Web3 from 'web3';
import { smartContract } from '../../smartContract';

export default function WithdrawButton({
  userAccount,
}: {
  userAccount: string;
}) {
  const web3 = new Web3('http://localhost:8545');
  async function handleWithdraw() {
    try {
      await smartContract.methods.withdrawFunds().call({ from: userAccount });
      alert('Withdrawal processed');
      const accounts = await web3.eth.getAccounts();
      for(const a of accounts) {
        console.log(a, await web3.eth.getBalance(a));
      }
    } catch (error) {
      alert(error);
    }
  }

  return (
    <button type='submit' onClick={handleWithdraw}>
      Withdraw the funds (OWNER)
    </button>
  );
}
