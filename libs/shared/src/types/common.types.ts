export type Keyable = string | number | symbol;

export type Translation = string;

export type ArrayItem<T> = T extends (infer U)[] ? U : T;
