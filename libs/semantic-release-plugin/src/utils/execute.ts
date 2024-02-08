import {execa, type Options} from 'execa';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const execute = (command: string, args: string[], options?: Options) => {
  return execa(command, args, {preferLocal: true, ...options});
};
