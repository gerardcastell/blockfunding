import { smartContract } from '../../smartContract';


export default function ClaimButton({ userAccount }: {
  userAccount: string,
}) {

  async function handleClaim() {
    try {
      await smartContract.methods.claim(userAccount).call();
      alert("Claim processed!")
    } catch (error) {
      alert(error);
    }
  };

  return (
    <button type="submit" onClick={handleClaim}>Claim (PATRON)</button>
  );
}
