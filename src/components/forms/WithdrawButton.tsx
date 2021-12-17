import { smartContract } from '../../smartContract';


export default function WithdrawButton({ userAccount }: {
  userAccount: string,
}) {

  async function handleWithdraw() {
    try {
      await smartContract.methods.claim(userAccount).call();
      alert("Withdrawal processed")
    } catch (error) {
      alert(error);
    }
  };

  return (
    <button type="submit" onClick={handleWithdraw}>Withdraw the funds</button>
  );
}
