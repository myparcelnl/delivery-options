import {executeWithErrorHandling} from '../utils';
import {type ContextWithNextRelease} from '../types';

export const setNpmAuth = async (context: ContextWithNextRelease): Promise<void> => {
  const {logger, cwd, env} = context;

  logger.log('Setting NPM token');

  await executeWithErrorHandling(
    'npm',
    ['config', '--global', 'set', '//registry.npmjs.org/:_authToken', context.env.NPM_TOKEN ?? ''],
    {cwd, env},
  );
};
