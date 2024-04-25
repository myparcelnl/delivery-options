/* eslint-disable @typescript-eslint/no-magic-numbers,no-magic-numbers */
import {type Config} from 'tailwindcss';
import {tailwindPreflightPlugin} from './private';

const config: Config = {
  content: ['src/**/*.{js,ts,vue,scss}', '../../libs/shared/src/**/*.{js,ts,vue,scss}'],
  darkMode: 'class',
  prefix: 'mp-',

  corePlugins: {
    /**
     * A modified variant of the preflight is added in the plugins section
     */
    preflight: false,

    /**
     * Also disable a bunch of built-ins we do not use to reduce the amount of --tw stuff added to the CSS
     */
    backdropBlur: false,
    backdropBrightness: false,
    backdropContrast: false,
    backdropFilter: false,
    backdropGrayscale: false,
    backdropHueRotate: false,
    backdropInvert: false,
    backdropOpacity: false,
    backdropSaturate: false,
    backdropSepia: false,
    backgroundAttachment: false,
    backgroundBlendMode: false,
    backgroundClip: false,
    backgroundImage: false,
    backgroundOrigin: false,
    backgroundPosition: false,
    backgroundRepeat: false,
    backgroundSize: false,
    boxShadow: false,
    boxShadowColor: false,
    contain: false,
    container: false,
    dropShadow: false,
    filter: false,
    fontFamily: false,
    fontSmoothing: false,
    fontStyle: false,
    fontVariantNumeric: false,
    gradientColorStops: false,
    grayscale: false,
    ringColor: false,
    ringOffsetColor: false,
    ringOffsetWidth: false,
    ringOpacity: false,
    ringWidth: false,
    scale: false,
    scrollBehavior: false,
    scrollMargin: false,
    scrollPadding: false,
    scrollSnapAlign: false,
    scrollSnapStop: false,
    scrollSnapType: false,
    skew: false,
  },

  plugins: [tailwindPreflightPlugin],

  theme: {
    extend: {
      maxHeight: ({theme}) => theme('height'),
      maxWidth: ({theme}) => theme('width'),
      minHeight: ({theme}) => theme('height'),
      minWidth: ({theme}) => theme('width'),
    },
  },
};

export default config;
