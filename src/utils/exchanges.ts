export function weiToEth(amount: string | number): string | number {
  if (typeof amount === 'string') {
    return (parseFloat(amount) / Math.pow(10, 18)).toString();
  } else {
    return amount / Math.pow(10, 18);
  }
}

export function ethToWei(amount: string | number): string | number {
  if (typeof amount === 'string') {
    return (parseFloat(amount) * Math.pow(10, 18)).toString();
  } else {
    return amount * Math.pow(10, 18);
  }
}

export function secondsToMillis(seconds: number) {
  return seconds * 1000;
}

export function daysToDeadline(input: string) {
  return Math.floor(
    (parseInt(input) * 1000 - new Date().getTime()) / (24 * 3600 * 1000)
  );
}

export function hoursToDeadline(input: string) {
  return Math.floor(
    (parseInt(input) * 1000 - new Date().getTime()) / (3600 * 1000)
  );
}

export function minutesToDeadline(input: string) {
  return Math.floor(
    (parseInt(input) * 1000 - new Date().getTime()) / (60 * 1000)
  );
}
