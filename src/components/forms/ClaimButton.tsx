import { IAccount } from '../shared/IAccount';
import { smartContract } from '../../smartContract';


export default function ClaimButton({ userAccount }: {
  userAccount: IAccount,
}) {

  async function handleClaim() {
    try {
      await smartContract.methods.claim(userAccount.address).call();
      alert("Claim processed!")
    } catch (error) {
      alert(error);
    }
  };

  return (
    <button type="submit" onClick={handleClaim}>Claim</button>
  );
}
