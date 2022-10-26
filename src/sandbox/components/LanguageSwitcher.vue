<template>
  <BNavItemDropdown
    :text="languageName($i18n.locale)"
    right>
    <BDropdownItem
      v-for="(locale, i) in availableLanguages"
      :key="`Lang${i}`"
      :active="locale === $i18n.locale"
      @click.prevent="$i18n.locale = locale">
      {{ languageName(locale) }}
    </BDropdownItem>
  </BNavItemDropdown>
</template>

<script>
export default {
  name: 'LanguageSwitcher',
  data() {
    return {
      availableLanguages: ['nl', 'en'],
      map: {
        nl: 'Nederlands',
        en: 'English',
      },
    };
  },

  methods: {
    languageName(locale) {
      return this.map[locale];
    },
  },
};
</script>
