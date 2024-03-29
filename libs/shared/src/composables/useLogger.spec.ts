/* eslint-disable no-console */
import {afterEach, describe, expect, it, vi} from 'vitest';
import {useLogger} from './useLogger';

describe('useLogger', () => {
  const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('logs debug messages', () => {
    const logger = useLogger();

    logger.debug('test');

    expect(logSpy).toHaveBeenCalled();
  });

  it('logs warning messages', () => {
    const logger = useLogger();

    logger.warning('test');

    expect(warnSpy).toHaveBeenCalled();
  });

  it('logs error messages', () => {
    const logger = useLogger();

    logger.error('test');

    expect(errorSpy).toHaveBeenCalled();
  });

  it('logs deprecated messages', () => {
    const logger = useLogger();

    logger.deprecated('test');

    expect(warnSpy).toHaveBeenCalled();
  });

  it('logs deprecated messages with replacement', () => {
    const logger = useLogger();

    logger.deprecated('test', 'replacement');

    expect(warnSpy).toHaveBeenCalled();
  });
});
