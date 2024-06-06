/* eslint-disable */
/// <reference types="vite/client" />
/// <reference types="@histoire/plugin-vue/components" />

declare module '*.vue' {
  import type {DefineComponent} from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare const __CLASS_BASE__: string;

declare const __VERSION__: string;

// Declared here to avoid "TS2686: L refers to a UMD global, but the current file is a module. Consider adding an import instead." error.
declare const L;
