export type Keyable = string | number | symbol;

export type Translation = string;

export type ArrayItem<T> = T extends (infer U)[] ? U : T;

export type ToRecord<T> = {
  [K in keyof T]: T[K];
};
