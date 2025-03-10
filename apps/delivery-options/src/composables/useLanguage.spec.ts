import {describe, it, expect, beforeEach, vi} from 'vitest';
import {type AnyTranslatable} from '@myparcel-do/shared';
import {useAddressStore, useConfigStore} from '../stores';
import {useLanguage} from './useLanguage';

describe('useLanguage', () => {
  beforeEach(() => {
    useConfigStore().reset();
    useLanguage.clear();

    vi.spyOn(console, 'error');
  });

  it.each([
    ['my_string', 'My String'],
    ['no_match', 'no_match'],
    [{key: 'my_string'}, 'My String'],
    [{key: 'no_match'}, 'no_match'],
    [{key: 'my_string', plain: true}, 'my_string'],
    [
      {
        key: 'string_with_args',
        args: {
          field: {key: 'number', plain: true},
          status: 'my_string',
        },
      },
      'My number is all My String',
    ],
    [
      {
        key: 'string_with_args',
        args: {
          field: {
            key: 'city',
            plain: true,
          },
        },
      },
      'My city is all {status}',
    ],
    [
      {
        key: 'string_with_args',
        args: {
          field: {
            key: 'string_with_args',
            args: {
              field: {
                key: 'number',
                plain: true,
              },
            },
          },
          status: {
            key: 'recursive',
            plain: true,
          },
        },
      },
      'My My number is all {status} is all recursive',
    ],
  ] satisfies [AnyTranslatable, string][])('can translate %s to %s', (translatable, expected) => {
    expect.assertions(1);

    const {setStrings, translate} = useLanguage();

    setStrings({
      my_string: 'My String',
      string_with_args: 'My {field} is all {status}',
    });

    expect(translate(translatable)).toBe(expected);
  });
});
