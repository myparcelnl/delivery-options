<template>
  <span>
    <Fa
      :icon="faInfoCircle"
      :class="{ [`text-${variant}`]: variant }" />

    <BPopover
      :target="target"
      v-bind="filteredProps">
      <slot />
    </BPopover>
  </span>
</template>

<script>
import Fa from 'vue-fa';
import{ debounce } from 'lodash-unified';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { hasVariantProp } from '../../delivery-options/src/sandbox/services/mixins/hasVariantProp';

export default {
  name: 'Help',

  components: { Fa },

  mixins: [
    hasVariantProp,
  ],

  props: {
    target: {
      type: String,
      default: null,
    },

    content: {
      type: String,
      default: null,
    },

    triggers: {
      type: String,
      default: 'click',
    },

    placement: {
      type: String,
      default: () => 'right',
    },

    compactPlacement: {
      type: String,
      default: () => 'top',
    },
  },

  data() {
    return {
      faInfoCircle,
      mutablePlacement: null,
    };
  },

  computed: {
    filteredProps() {
      return {
        ...this.$props,
        placement: this.mutablePlacement,
      };
    },
  },

  created() {
    const setPlacement = () => {
      const SMALL_SCREEN_WIDTH = 767;

      if (window.innerWidth <= SMALL_SCREEN_WIDTH) {
        this.mutablePlacement = this.$props.compactPlacement;
        return;
      }

      this.mutablePlacement = this.$props.placement;
    };

    window.addEventListener('resize', debounce(setPlacement, 100));
    setPlacement();
  },
};
</script>
