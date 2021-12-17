import Web3 from "web3";

export async function fetchAccounts(
    web3: Web3,
    setter: React.Dispatch<React.SetStateAction<string[]>>
): Promise<void> {
    const accountNumbers = await web3.eth.getAccounts();
    await window.ethereum.request({
        method: 'eth_requestAccounts',
    });
    setter(() => []); // TODO: REMOVE THIS (used to not accumulate accounts when developing)
    for (const accountNumber of accountNumbers) {
        const balance = await web3.eth.getBalance(accountNumber);
        setter((accounts) => [...accounts, accountNumber]);
    }
}

export function changeState(
    setState: React.Dispatch<React.SetStateAction<any>>,
    field: string,
    newValue: any): void {
    setState((prevState: any) => ({ ...prevState, [field]: newValue }));
}
