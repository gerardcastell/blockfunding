import { smartContract } from '../../smartContract';

export default function WithdrawButton({
  userAccount,
}: {
  userAccount: string;
}) {
  async function handleWithdraw() {
    try {
      await smartContract.methods.withdrawFunds().call({ from: userAccount });
      alert('Withdrawal processed');
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
