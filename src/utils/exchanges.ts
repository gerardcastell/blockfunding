export function weiToEth(amount: string | number): string | number {
    if (typeof amount === "string"){ 
        return (parseFloat(amount) / Math.pow(10, 18)).toString();
    } else {
        return amount / Math.pow(10, 18)
    }
};

export function ethToWei(amount: string | number): string | number {
    if (typeof amount === "string"){ 
        return (parseFloat(amount) * Math.pow(10, 18)).toString();
    } else {
        return amount * Math.pow(10, 18)
    }
};