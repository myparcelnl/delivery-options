import {describe, it, expect, beforeEach} from 'vitest';
import {ApiException} from '@myparcel-dev/sdk';
import {type TranslatableWithArgs} from '../types';
import {ERROR_INVALID_POSTAL_CODE, IGNORED_ERRORS, ERROR_MISSING_REQUIRED_PARAMETER, ERROR_REPLACE_MAP} from '../data';
import {useApiExceptions} from './useApiExceptions';

const createException = (code: string | number, message = 'error'): ApiException => {
  return new ApiException({
    message: 'error',
    request_id: '...',
    errors: [{code: Number(code), message}],
  });
};

describe('useApiExceptions', () => {
  beforeEach(() => {
    useApiExceptions().clear();
  });

  it('adds exceptions', () => {
    const {addException, exceptions, hasExceptions} = useApiExceptions();
    const exception = createException(ERROR_INVALID_POSTAL_CODE);

    addException(['test'], exception);

    expect(hasExceptions.value).toBe(true);
    expect(exceptions.value).toEqual([
      {
        code: ERROR_INVALID_POSTAL_CODE,
        label: `error${ERROR_INVALID_POSTAL_CODE}`,
      },
    ]);

    addException(['test'], createException(ERROR_INVALID_POSTAL_CODE));

    // Expect no duplicates
    expect(exceptions.value).toHaveLength(1);
  });

  it.each(IGNORED_ERRORS)('ignores exceptions with code %s', (code) => {
    const {addException, exceptions, hasExceptions} = useApiExceptions();
    const exception = createException(code);

    addException(['someRequest'], exception);

    expect(hasExceptions.value).toBe(false);
    expect(exceptions.value).toEqual([]);
  });

  it.each(Object.entries(ERROR_REPLACE_MAP))(`replaces error code %d with %d`, (code, replacement) => {
    const {addException, exceptions, hasExceptions} = useApiExceptions();
    const exception = createException(code);

    addException(['test'], exception);

    expect(hasExceptions.value).toBe(true);
    expect(exceptions.value).toEqual([
      {
        code: replacement,
        label: `error${replacement}`,
      },
    ]);
  });

  it('can clear exceptions', () => {
    const {addException, clear, hasExceptions, exceptions} = useApiExceptions();
    const exception = createException(ERROR_INVALID_POSTAL_CODE);

    addException(['test'], exception);

    expect(hasExceptions.value).toBe(true);

    clear();

    expect(hasExceptions.value).toBe(false);
    expect(exceptions.value).toEqual([]);
  });

  it.each([
    ['city', 'city'],
    ['street', 'street'],
    ['number', 'street'],
  ])(`adds arguments to exception with code ${ERROR_MISSING_REQUIRED_PARAMETER}`, (field, finalKey) => {
    const {addException, exceptions, hasExceptions} = useApiExceptions();
    const exception = createException(ERROR_MISSING_REQUIRED_PARAMETER, `${field} is required`);

    addException(['test'], exception);

    expect(hasExceptions.value).toBe(true);
    expect(exceptions.value).toEqual([
      {
        code: ERROR_MISSING_REQUIRED_PARAMETER,
        label: {
          key: `error${ERROR_MISSING_REQUIRED_PARAMETER}`,
          args: {
            field: finalKey,
          },
        } satisfies TranslatableWithArgs,
      },
    ]);
  });
});
