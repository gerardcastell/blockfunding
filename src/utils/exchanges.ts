export function weiToEth(amount: string): number {
    return (parseFloat(amount) / Math.pow(10, 18));
};

export function ethToWei(amount: string): number {
    return (parseFloat(amount) * Math.pow(10, 18));
};