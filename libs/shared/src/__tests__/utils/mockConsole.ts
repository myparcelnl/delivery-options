import {vi} from 'vitest';

export const consoleLogSpy = vi.fn();

export const consoleErrorSpy = vi.fn();

export const consoleWarnSpy = vi.fn();

export const mockConsole = (): void => {
  vi.spyOn(console, 'log').mockImplementation(consoleLogSpy);
  vi.spyOn(console, 'error').mockImplementation(consoleErrorSpy);
  vi.spyOn(console, 'warn').mockImplementation(consoleWarnSpy);
};

export const resetConsole = (): void => {
  consoleLogSpy.mockRestore();
  consoleErrorSpy.mockRestore();
  consoleWarnSpy.mockRestore();
};
