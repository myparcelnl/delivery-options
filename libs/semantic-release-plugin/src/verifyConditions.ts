import {addError, throwIfHasErrors, execute} from './utils';
import {type VerifyConditionsCmd} from './types';

export const verifyConditions: VerifyConditionsCmd = async (_, {env, options}) => {
  /**
   * GitHub Actions sets this variable only when the job has `id-token: write`, and pnpm needs it to publish through
   * npm trusted publishing (OIDC). Without this check, a missing permission fails only at `pnpm publish`, after
   * semantic-release pushed the tag. A dry run does not publish, so it skips the check.
   */
  if (!options?.dryRun && !env.ACTIONS_ID_TOKEN_REQUEST_URL) {
    addError(
      new Error(
        'ACTIONS_ID_TOKEN_REQUEST_URL is not set: give the release job `id-token: write` for npm trusted publishing',
      ),
    );
  }

  const result = await execute('git', ['push', 'origin', '--dry-run'], {env, stdio: 'ignore'});

  if (result.stderr) {
    addError(new Error(result.stderr));
  }

  throwIfHasErrors();
};
