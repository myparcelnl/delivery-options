export type Translation = string;

export type ToRecord<T> = {
  [K in keyof T]: T[K];
};

export type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type UnionExcept<T, U> = T extends U ? never : T;
