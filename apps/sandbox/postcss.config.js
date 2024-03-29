import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [tailwindcss('./tailwind.config.ts'), tailwindcss('../delivery-options/tailwind.config.ts'), autoprefixer],
};
