import {describe, it, expect, beforeEach, vi} from 'vitest';
import {setActivePinia, createPinia} from 'pinia';
import {type AnyTranslatable} from '@myparcel-do/shared';
import {useLanguage} from './useLanguage';

describe('useLanguage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    useLanguage.clear();

    vi.spyOn(console, 'error');
  });

  it.each([
    ['my_string', 'My String'],
    ['no_match', 'no_match'],
    [{key: 'my_string'}, 'My String'],
    [{key: 'no_match'}, 'no_match'],
    [{key: 'my_string', plain: true}, 'my_string'],
  ] satisfies [AnyTranslatable, string][])('can translate %s to %s', (translatable, expected) => {
    expect.assertions(1);

    const {setStrings, translate} = useLanguage();

    setStrings({
      my_string: 'My String',
    });

    expect(translate(translatable)).toBe(expected);
  });
});
