export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-replace': {
      pattern: /(--tw|\*, ::before, ::after)/g,
      data: {
        // Prefixing
        '--tw': '--mp-tw',
        // So variables does not pollute every element
        '*, ::before, ::after': ':root',
      },
    },
    ...(process.env.NODE_ENV === 'production' ? {cssnano: {}} : {}),
  },
};
