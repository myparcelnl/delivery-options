<template>
  <Teleport to="body">
    <div
      v-show="modelValue"
      role="dialog"
      aria-modal="true"
      data-testid="modal"
      class="mp-fixed mp-flex mp-inset-0 mp-items-center mp-justify-center mp-z-50"
      @click.self="close">
      <div
        class="mp-absolute mp-bg-black mp-inset-0 mp-opacity-40"
        data-testid="modal-backdrop"
        @click="close" />

      <div
        class="mp-bg-white mp-flex mp-flex-col mp-h-[80vh] mp-max-h-[900px] mp-max-w-[1200px] mp-overflow-hidden mp-relative mp-rounded-lg mp-shadow-xl mp-w-[80vw]">
        <header
          v-if="$slots.header"
          class="mp-border-b mp-px-4 mp-py-3">
          <slot name="header" />
        </header>

        <div class="mp-flex-grow mp-overflow-auto">
          <slot />
        </div>

        <footer
          v-if="$slots.footer"
          class="mp-border-t mp-flex mp-justify-end mp-px-4 mp-py-3">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted} from 'vue';

const props = defineProps<{modelValue: boolean}>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}>();

const close = (): void => {
  emit('update:modelValue', false);
  emit('close');
};

const onKey = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && props.modelValue) {
    close();
  }
};

onMounted(() => document.addEventListener('keydown', onKey));
onUnmounted(() => document.removeEventListener('keydown', onKey));
</script>
