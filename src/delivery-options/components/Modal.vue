<template>
  <div
    :class="{
      [`${$classBase}__modal`]: true,
      [`${$classBase}__modal--full`]: !inline,
      [`${$classBase}__modal--inline`]: inline,
    }">
    <div
      v-if="hasCloseButton"
      :class="`${$classBase}__modal__close`"
      @click="inline ? $emit('close') : $configBus.showModal = false">
      <Fa :icon="faTimes" />
    </div>
    <component
      :is="component"
      :data="modalData">
      <slot
        v-for="(_, name) in $slots"
        :name="name" />
    </component>
  </div>
</template>

<script>
import Fa from 'vue-fa';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default {
  name: 'Modal',
  components: { Fa },
  props: {
    inline: {
      type: Boolean,
    },

    component: {
      type: Object,
      default: null,
    },

    modalData: {
      type: Object,
      default: null,
    },

    hasCloseButton: {
      type: Boolean,
    },
  },

  data() {
    return {
      faTimes,
    };
  },
};
</script>
