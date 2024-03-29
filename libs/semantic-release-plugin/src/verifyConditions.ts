import {addError, throwIfHasErrors, execute} from './utils';
import {type VerifyConditionsCmd} from './types';

export const verifyConditions: VerifyConditionsCmd = async (_, {env}) => {
  if (!env.NPM_TOKEN) {
    addError(new Error('NPM_TOKEN environment variable is required'));
  }

  const result = await execute('git', ['push', 'origin', '--dry-run'], {env, stdio: 'ignore'});

  if (result.stderr) {
    addError(new Error(result.stderr));
  }

  throwIfHasErrors();
};
