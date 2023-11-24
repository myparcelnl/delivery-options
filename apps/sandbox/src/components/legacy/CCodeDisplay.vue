<template>
  <pre
    :class="{
      [`code--${language}`]: language,
      'code--loading': loading,
    }"
    class="card code code--block"
    @click="handleClick"
    @mouseout="listeners.mouseOut"
    @mouseover="listeners.mouseOver"
    v-html="codeHtml" />
</template>

<script lang="ts">
import {CODE_FORMAT_JAVASCRIPT} from '../config/forms/codeFormats';

export default {
  name: 'CCodeDisplay',
  props: {
    loading: Boolean,
    code: {
      type: String,
      default: null,
    },

    language: {
      type: String,
      default: () => CODE_FORMAT_JAVASCRIPT,
    },

    allowHover: {
      type: Array,
      default: null,
    },
  },

  data() {
    const MOUSE_DEBOUNCE_DELAY = 15;

    return {
      hovered: null,
      listeners: {
        mouseOver: debounce(this.handleMouseOver, MOUSE_DEBOUNCE_DELAY),
        mouseOut: debounce(this.handleMouseOut, MOUSE_DEBOUNCE_DELAY),
      },
    };
  },

  computed: {
    codeHtml() {
      const language = hljs.getLanguage(this.language) ? this.language : 'javascript';
      const content = hljs.highlight(this.code, {language}).value;

      return `<div class="code__wrapper">${content}</div>`;
    },
  },

  methods: {
    handleClick({target}) {
      if (target.tagName !== 'SPAN') {
        return;
      }

      this.$emit('click', target);
    },

    handleMouseOver({target}) {
      const hoverAllowed = this.allowHover && this.allowHover.includes(target.innerText);

      if (!hoverAllowed || target.tagName !== 'SPAN' || target.classList.contains('code--hover')) {
        return;
      }

      this.hovered = target;

      target.classList.add('code--hover');
    },

    handleMouseOut() {
      if (!this.hovered) {
        return;
      }

      this.hovered.classList.remove('code--hover');
      this.hovered = null;
    },
  },
};
</script>
