import {describe, it, expect} from 'vitest';
import {createTranslatable} from './createTranslatable';

describe('createTranslatable', () => {
  it('should create a translatable object with a key', () => {
    const translatable = createTranslatable('test_key');

    expect(translatable).toEqual({
      key: 'test_key',
      parameters: undefined,
    });
  });

  it('should create a translatable object with key and parameters', () => {
    const args = {name: createTranslatable('name'), age: createTranslatable('age')};
    const translatable = createTranslatable('greeting', args);

    expect(translatable).toEqual({
      key: 'greeting',
      args,
    });
  });

  it('should handle empty parameters object', () => {
    const translatable = createTranslatable('test_key', {});

    expect(translatable).toEqual({
      key: 'test_key',
      args: {},
    });
  });
});
