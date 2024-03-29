/* eslint-disable no-console */
import {useLocalStorage, useMemoize} from '@vueuse/core';

type ConsoleMessages = unknown[];

export interface LoggerInstance {
  debug(...messages: ConsoleMessages): void;

  deprecated(thing: string, replacement?: string): void;

  error(...messages: ConsoleMessages): void;

  warning(...messages: ConsoleMessages): void;
}

export enum LogLevel {
  Off = 0,
  Error = 1,
  Warning = 2,
  Debug = 3,
}

const logLevel = useLocalStorage('logLevel', import.meta.env.PROD ? LogLevel.Off : LogLevel.Debug, {
  writeDefaults: false,
});

export const useLogger = useMemoize((): LoggerInstance => {
  const debug = (...messages: ConsoleMessages): void => {
    if (logLevel.value < LogLevel.Debug) {
      return;
    }

    console.log('%c[DEBUG]', 'color: #999', ...messages);
  };

  const warning = (...messages: ConsoleMessages): void => {
    if (logLevel.value < LogLevel.Warning) {
      return;
    }

    console.warn('%c[WARNING]', 'color: #ff0', ...messages);
  };

  const error = (...messages: ConsoleMessages): void => {
    if (logLevel.value < LogLevel.Error) {
      return;
    }

    console.error('%c[ERROR]', 'color: #f00', ...messages);
  };

  const deprecated = (thing: string, replacement?: string): void => {
    warning(`⚠️ ${thing} is deprecated.${replacement ? ` Please use ${replacement} instead.` : ''}`);
  };

  return {
    debug,
    warning,
    error,
    deprecated,
  };
});
