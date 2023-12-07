import {describe, expect, it} from 'vitest';
import {crushObject} from './crushObject';

describe('crushObject', () => {
  it('turns objects into dot notation, leaving non-objects intact', () => {
    const obj = {
      test: {
        appel: 'boom',
      },
      test2: {
        cms: 'magento',
        set: new Set(['foo', 'bar']),
        nested: {
          even: {
            deeper: 'bar',
            array: ['foo', 'bar'],
            complexArray: [
              {test: 1, value: 'yes'},
              {test: 2, value: 'no'},
            ],
          },
        },
      },
    };

    const result = {
      'test.appel': 'boom',
      'test2.cms': 'magento',
      'test2.set': new Set(['foo', 'bar']),
      'test2.nested.even.deeper': 'bar',
      'test2.nested.even.array': ['foo', 'bar'],
      'test2.nested.even.complexArray': [
        {test: 1, value: 'yes'},
        {test: 2, value: 'no'},
      ],
    };

    expect(crushObject(obj)).toEqual(result);
  });
});
