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

export function secondsToMillis(seconds: number) {
    return seconds * 1000;
}

export const MILLIS_X_DAYS = 24 * 60 * 60 * 1000; 

// ${((secondsToMillis(state.deadline)) - new Date().getMilliseconds()) / MILLIS_X_DAYS}