import semver from 'semver';

export const getChannel = (channel?: string): string => {
  if (channel) {
    return semver.validRange(channel) ? `release-${channel}` : channel;
  }

  return 'latest';
};
