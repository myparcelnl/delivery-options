import {WrapperArray} from '@vue/test-utils';

declare global {
  namespace jest {
    interface Matchers<R> {
      toContainObject(argument: Record<string, any>, extraData?: string): R;
    }
  }
}

declare interface Wrapper {
  findByTestId(id: string): Wrapper;

  findAllByTestId(id: string): WrapperArray<any>;

  findChoice(id: string, choice: string): Wrapper;
}
