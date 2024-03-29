import {type DebugLogger} from 'node:util';

export interface PluginConfig {
  /**
   * Directories of additional packages to publish.
   */
  additionalPackages?: string[];
  npmPublish?: boolean;
  pkgRoot?: string;
}

export interface Context {
  cwd: string;
  env: NodeJS.ProcessEnv;
  logger: {
    log: DebugLogger;
  };
  stderr: NodeJS.WriteStream;
  stdout: NodeJS.WriteStream;
}

export interface ContextWithNextRelease extends Context {
  nextRelease: {
    version: string;
    channel: string;
    notes: string;
  };
}

export type VerifyConditionsCmd = (pluginConfig: PluginConfig, context: Context) => Promise<void> | void;

export type PrepareCmd = (pluginConfig: PluginConfig, context: ContextWithNextRelease) => Promise<void> | void;

export type PublishCmd = (pluginConfig: PluginConfig, context: ContextWithNextRelease) => Promise<void> | void;
