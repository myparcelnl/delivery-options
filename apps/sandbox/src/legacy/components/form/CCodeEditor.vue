<template>
  <div
    v-click-outside="showCode"
    class="d-flex flex-column">
    <div
      v-show="codeShown"
      v-test="'code'"
      @click="hideCode">
      <CCodeDisplay
        :code="mutableValue"
        :language="language"
        class="mt-0 text-pre" />
    </div>
    <pre
      v-show="!codeShown"
      v-test="'text'"
      class="card code code--text overflow-visible text-pre">
      <CTextarea
        v-model="mutableValue"
        :class="{
          'is-invalid': !valid,
        }"
        rows="20"
        v-bind="filteredProps" />
    </pre>
  </div>
</template>

<script lang="ts">
import CTextarea from './CTextarea.vue';

export default {
  name: 'CCodeEditor',
  components: {
    CCodeDisplay: () => import(/* webpackChunkName: "components/CCodeDisplay" */ '@/sandbox/components/CCodeDisplay'),
    CTextarea,
  },

  directives: {
    ClickOutside,
  },

  mixins: [formTextarea],

  props: {
    language: {
      type: String,
      default: () => 'json',
    },
  },

  data() {
    return {
      valid: true,
      codeShown: true,
    };
  },

  computed: {
    mutableValue: {
      get() {
        return formatCode(this.value, 'json');
      },

      /**
       * Emit event with the new value.
       *
       * @param {*} value - New value.
       */
      set(value) {
        try {
          JSON.parse(value);
          this.valid = true;
          this.$emit('input', value);
        } catch (e) {
          // We're not using e because it will simply say it's invalid JSON.
          this.valid = false;
        }
      },
    },
  },

  methods: {
    showCode() {
      if (this.codeShown) {
        return;
      }

      this.codeShown = true;
    },

    hideCode() {
      this.codeShown = false;
    },
  },
};
</script>
