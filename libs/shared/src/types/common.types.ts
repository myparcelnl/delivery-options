export type ToRecord<T> = {
  [K in keyof T]: T[K];
};

export type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
