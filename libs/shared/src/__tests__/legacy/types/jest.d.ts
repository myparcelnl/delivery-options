import {type WrapperArray} from '@vue/test-utils';

declare namespace jest {
  interface Matchers<R> {
    toContainObject(argument: Record<string, any>, extraData?: string): R;
  }
}

declare interface Wrapper {
  findAllByTestId(id: string): WrapperArray<any>;

  findByTestId(id: string): Wrapper;

  findChoice(id: string, choice: string): Wrapper;
}

declare interface Wrapper {
  findAllByTestId(id: string): WrapperArray<any>;

  findByTestId(id: string): Wrapper;

  findChoice(id: string, choice: string): Wrapper;
}
