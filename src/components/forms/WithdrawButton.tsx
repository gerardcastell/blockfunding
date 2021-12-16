import { IAccount } from '../shared/IAccount';
import { smartContract } from '../../smartContract';


export default function WithdrawButton({ userAccount }: {
  userAccount: IAccount,
}) {

  async function handleWithdraw() {
    try {
      await smartContract.methods.claim(userAccount.address).call();
      alert("Withdrawal processed")
    } catch (error) {
      alert(error);
    }
  };

  return (
    <button type="submit" onClick={handleWithdraw}>Withdraw the funds</button>
  );
}
