/**
 * Pause the program for x milliseconds.
 * @param ms
 */
export function sleep(ms: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export function isPasswordValid(password: string): boolean {
  return password !== undefined && password !== null && password.length >= 8 && /\d+/.test(password) && /[a-z]+/.test(password) && /[A-Z]+/.test(password);
}
