import {type Options} from 'execa';
import {execute} from './execute';
import {addError} from './errorHandling';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const executeWithErrorHandling = async (command: string, args: string[], options?: Options) => {
  const result = await execute(command, args, options);

  if (result.exitCode !== 0) {
    addError(new Error(`Command "${command} ${args.join(' ')}" failed: ${result.stderr}`));
  }

  return result;
};
