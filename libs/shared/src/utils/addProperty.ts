export const addProperty = <T, P extends string, V>(
  object: T,
  property: P,
  value: V,
): T & {
  [K in P]: V;
} => {
  Object.defineProperty(object, property, {
    get() {
      return value;
    },
  });

  return object as T & Record<P, V>;
};
