/* eslint-disable no-console */
import glob from 'fast-glob';
import {spawnSync} from 'child_process';

/** @type {CreateCommonTsupConfig} */
const createCommonTsupConfig = () => {
  const files = glob.sync('src/**/*.ts');
  const tsconfig = 'tsconfig.build.json';

  return {
    entry: files,
    format: ['esm'],
    outDir: 'lib',
    target: 'esnext',
    tsconfig,
    onSuccess() {
      const timeStart = Date.now();

      console.log('\x1b[34m%s\x1b[0m', 'DTS', '\x1b[0m', 'Generating declaration files...');
      spawnSync('tsc', ['--project', tsconfig, '--emitDeclarationOnly', '--declarationDir', 'lib', '--declaration']);
      console.log('\x1b[34m%s\x1b[0m', 'DTS', '\x1b[0m', `Done in ${Date.now() - timeStart}ms`);
    },
  };
};

/** @type {import('.').createTsupConfig} */
export const createTsupConfig = (config) => {
  const resolvedConfig = config ?? {};

  return {...createCommonTsupConfig(), ...resolvedConfig};
};
