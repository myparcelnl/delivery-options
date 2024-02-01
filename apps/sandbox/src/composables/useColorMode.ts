import {useColorMode as vuUseColorMode} from '@vueuse/core';

export const useColorMode = (): ReturnType<typeof vuUseColorMode> => {
  return vuUseColorMode({modes: {dark: 'mp-dark'}});
};
