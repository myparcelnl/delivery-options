import {addError, throwIfHasErrors} from './utils';
import {type VerifyConditionsCmd} from './types';

export const verifyConditions: VerifyConditionsCmd = (_, {env}) => {
  if (!env.NPM_TOKEN) {
    addError(new Error('NPM_TOKEN environment variable is required'));
  }

  throwIfHasErrors();
};
