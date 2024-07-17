/* eslint-disable no-console */
import {afterEach, describe, expect, it, vi} from 'vitest';
import {consoleLogSpy, consoleWarnSpy, consoleErrorSpy} from '@myparcel-do/shared/testing';
import {useLogger} from './useLogger';

describe('useLogger', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('logs debug messages', () => {
    const logger = useLogger();

    logger.debug('test');

    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it('logs warning messages', () => {
    const logger = useLogger();

    logger.warning('test');

    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  it('logs error messages', () => {
    const logger = useLogger();

    logger.error('test');

    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('logs deprecated messages', () => {
    const logger = useLogger();

    logger.deprecated('test');

    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  it('logs deprecated messages with replacement', () => {
    const logger = useLogger();

    logger.deprecated('test', 'replacement');

    expect(consoleWarnSpy).toHaveBeenCalled();
  });
});
