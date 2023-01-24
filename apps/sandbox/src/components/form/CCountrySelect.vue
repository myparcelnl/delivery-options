<template>
  <CSelect
    v-model="mutableValue"
    :options="mutableOptions" />
</template>

<script>
import CSelect from '@/sandbox/components/form/CSelect';

/**
 * @param id
 */
export async function serverImport(id) {
  const { createRequire } = await import('module');
  const require = createRequire('/../../../package.json');
  return require(id);
}

export default {
  name: 'CCountrySelect',
  components: { CSelect },
  extends: CSelect,

  props: {
    disabledOption: {
      type: String,
      default: 'form.country',
    },
  },

  data() {
    return {
      mutableOptions: this.options,
      countryModules: [],
    };
  },

  watch: {

    /**
     * Update the countries list on load and locale change.
     */
    '$i18n.locale': {
      handler(locale) {
        const key = Object.keys(this.countryModules).find((key) => key.endsWith(`${locale}.json`));
        const countries = this.countryModules[key] ?? [];

        this.mutableOptions = Object.keys(countries).map((country) => {
          return {
            value: country,
            text: countries[country],
          };
        });
      },

      immediate: true,
    },
  },

  beforeMount() {
    this.countryModules = import.meta.globEager('@/sandbox/translations/countries/*.json');
  },
};
</script>
