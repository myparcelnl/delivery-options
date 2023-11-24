<template>
  <div
    ref="selectWrapper"
    :class="{
      'mp-rounded-full': !isOpen,
      'mp-rounded-t-[28px]': isOpen,
    }"
    :tabindex="loading || element.isDisabled ? -1 : 0"
    class="focus:mp-outline-2 focus:mp-ring-0 mp-outline-goldfish-500 mp-relative mp-select-none mp-w-full"
    role="listbox"
    @focus="open"
    @focusout="close"
    @keydown.enter.prevent="() => (isOpen ? selectOptionAtCursor() : null)"
    @keydown.esc.prevent="close"
    @keydown.space.prevent="toggle"
    @keydown.up.prevent="() => (isOpen ? previous() : null)"
    @keydown.down.prevent="() => (isOpen ? next() : null)">
    <Loader.Wrapper
      v-if="loading"
      class="mp-absolute mp-inset-0">
      <Loader.Circle class="mp-h-full mp-w-full" />
    </Loader.Wrapper>

    <div
      :class="{
        'mp-rounded-full': !isOpen,
        'mp-rounded-t-[28px]': isOpen,
        'mp-opacity-50': element.isDisabled,
        'mp-opacity-100': !element.isDisabled,
        'mp-invisible': loading,
      }"
      class="mp-bg-white mp-border mp-px-4"
      @mousedown.stop="toggle">
      <div class="mp-flex">
        <div class="mp-flex mp-flex-col mp-relative">
          <label
            :class="{
              'mp-text-xs': currentOption,
              'mp-text-md mp-top-1/2 mp-transform mp--translate-y-1/2': !currentOption,
            }"
            class="mp-absolute mp-top-0 mp-transition-all"
            v-text="translate('option_placeholder')" />

          <div class="mp-pb-3 mp-pt-5">
            <span v-text="currentOption?.label ?? '&nbsp;'" />
          </div>
        </div>

        <div class="mp-flex mp-items-center mp-ml-auto">
          <svg
            :class="{
              'mp-rotate-180': isOpen,
            }"
            class="mp-h-5 mp-text-gray-400 mp-w-5"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <div
      v-show="isOpen"
      class="mp-absolute mp-border mp-border-t-0 mp-overflow-hidden mp-rounded-b-[28px] mp-w-full mp-z-10">
      <div
        v-for="(option, index) in filteredOptions"
        :key="option.value"
        :class="{
          'mp-bg-gray-300': cursor === index,
          'mp-bg-white': cursor !== index,
        }"
        class="mp-cursor-pointer mp-px-4 mp-py-2"
        role="listitem"
        @click="() => selectOption(option)"
        @mouseover.stop="cursor = index">
        <span v-text="option.label" />
      </div>
    </div>
  </div>
</template>

<script generic="T extends SelectInputModelValue" lang="ts" setup>
import {computed, ref} from 'vue';
import {Loader, type SelectOption} from '@myparcel-do/shared';
import {type SelectInputEmits, type SelectInputModelValue, type SelectInputProps, type WithElement} from '../types';
import {useClickOutside} from '../compsables/useClickOutside';
import {useOpenState} from '../composables/useOpenState';
import {useCursor} from '../composables/useCursor';
import {useLanguage, useSelectInputContext} from '../composables';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<SelectInputProps<T>> & {options?: any; loading?: boolean}>();
const emit = defineEmits<SelectInputEmits<T>>();

const {model, options} = useSelectInputContext(props, emit);

const currentOption = computed(() => options.value.find((option) => option.value === model.value));
const filteredOptions = computed(() => options.value.filter((option) => option.value !== model.value));

const selectWrapper = ref<HTMLElement | null>(null);

const {cursor, next, previous, reset} = useCursor({items: filteredOptions});

const {isOpen, open, close, toggle} = useOpenState({
  onClose() {
    reset();
  },
});

const selectOption = <T1 extends T>(option: SelectOption<T1>) => {
  model.value = option.value;
  close();
};

const selectOptionAtCursor = () => {
  if (cursor.value === -1) {
    return;
  }

  selectOption(filteredOptions.value[cursor.value]);
};

useClickOutside(selectWrapper, close);

const {translate} = useLanguage();
</script>
