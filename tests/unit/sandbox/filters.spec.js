import { formatCode } from '@/sandbox/services/filters/formatCode';

describe('filters', () => {
  test('formatCode', () => {
    const code = {
      data: {
        delivery_options: [
          {
            one: true,
            two: false,
          },
        ],
      },
    };

    const result = `{
  data: {
    delivery_options: [
      {
        one: true,
        two: false
      }
    ]
  }
}`;

    expect(formatCode(code)).toBe(result);
    expect(formatCode(JSON.stringify(code))).toBe(result);
  });
});
