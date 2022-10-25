export const hasOwnProperty = <
  X extends Record<string, unknown>,
  Y extends PropertyKey>(object: X, prop: Y,
): object is X & Record<Y, unknown> => {
  return typeof object === 'object' && object.hasOwnProperty(prop);
};
