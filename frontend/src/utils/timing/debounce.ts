type Opts = {};

export default function debounce(delayMs: number, handler: Function) {
  let timeoutId: NodeJS.Timeout;

  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => handler(...args), delayMs);
  };
}
