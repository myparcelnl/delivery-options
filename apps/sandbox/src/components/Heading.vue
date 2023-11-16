<template>
  <component
    :is="`h${level}`"
    :id="id || uniqueId">
    <slot />
    <Help
      v-if="helpText"
      :content="$te(helpText) ? $t(helpText) : helpText"
      :target="id || uniqueId"
      placement="bottom-right"
      triggers="hover" />
  </component>
</template>

<script lang="ts">
import {uniqueIdMixin} from '../services/mixins/uniqueIdMixin';
import Help from './Help.vue';

export default {
  name: 'Heading',
  components: {Help},

  mixins: [uniqueIdMixin],

  /* eslint-disable no-magic-numbers */
  props: {
    id: {
      type: String,
      default: null,
    },

    level: {
      type: Number,
      default: 1,
    },

    helpText: {
      type: String,
      default: null,
    },
  },
  /* eslint-enable no-magic-numbers */
};
</script>
