import {throwIfHasErrors, executeWithErrorHandling} from '../utils';
import {type ContextWithNextRelease} from '../types';

export const gitPush = async (context: ContextWithNextRelease): Promise<void> => {
  const {env, cwd, logger} = context;

  logger.log('Pushing to remote');
  await executeWithErrorHandling('git', ['push', '--all'], {env, cwd, stdio: 'inherit'});

  throwIfHasErrors();
};
