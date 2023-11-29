<template>
  <select v-model="model">
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value">
      {{ option.label }}
    </option>
  </select>

  <div
    ref="selectWrapper"
    :class="{
      'mp-rounded-full': !isOpen,
      'mp-rounded-t-[28px]': isOpen,
    }"
    class="dark:mp-text-white mp-relative mp-select-none mp-w-full"
    v-bind="$attrs"
    @click="() => searchRef?.focus()"
    @keydown.space.prevent="() => selectOptionAtCursor()"
    @keydown.enter.prevent="() => selectOptionAtCursor()"
    @keydown.esc.prevent="close"
    @keydown.up.prevent="onPressUp"
    @keydown.tab="onPressTab"
    @keydown.down.prevent="onPressDown">
    <Loader.Wrapper
      v-if="loading"
      class="mp-absolute mp-inset-0">
      <Loader.Circle class="mp-h-full mp-w-full" />
    </Loader.Wrapper>

    <input
      ref="searchRef"
      v-model="searchText"
      :tabindex="loading || element.isDisabled ? -1 : 0"
      class="mp-peer mp-sr-only"
      role="listbox"
      @focusout="onPressTab" />

    <div
      :class="{
        'mp-rounded-full': !isOpen,
        'mp-rounded-t-[28px]': isOpen,
        'mp-opacity-50': element.isDisabled,
        'mp-opacity-100': !element.isDisabled,
        'mp-invisible': loading,
      }"
      class="dark:mp-bg-gray-800 mp-bg-white mp-border mp-outline-goldfish-500 mp-px-4 peer-focus:mp-outline-2 peer-focus:mp-ring-0"
      @mousedown.stop="toggle">
      <span class="mp-flex">
        <span class="mp-flex mp-flex-col mp-relative">
          <span
            :class="{
              'mp-text-xs': currentOption,
              'mp-text-md mp-top-1/2 mp-transform mp--translate-y-1/2': !currentOption,
            }"
            class="mp-absolute mp-top-0 mp-transition-all"
            v-text="translate('option_placeholder')" />

          <span class="mp-pb-3 mp-pt-5">
            <span v-text="currentOption?.label ?? '&nbsp;'" />
          </span>
        </span>

        <span class="mp-flex mp-items-center mp-ml-auto">
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
        </span>
      </span>
    </div>

    <div
      v-show="isOpen"
      class="dark:mp-bg-gray-800 mp-absolute mp-bg-white mp-border mp-border-t-0 mp-overflow-y-scroll mp-rounded-b-[28px] mp-w-full mp-z-10">
      <div
        ref="optionsWrapper"
        class="mp-max-h-72">
        <div
          v-for="(option, index) in filteredOptions"
          :key="option.value"
          :aria-selected="option.value === model"
          :class="{
            'mp-bg-gray-300 dark:mp-bg-gray-700': cursor === index,
          }"
          class="mp-cursor-pointer mp-px-4 mp-py-2"
          role="option"
          @mouseup.stop="() => selectOption(option)"
          @mouseover.stop="cursor = index">
          <span v-text="option.label" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {inheritAttrs: false};
</script>

<script generic="T extends SelectInputModelValue" lang="ts" setup>
import {computed, nextTick, ref, watch} from 'vue';
import {
  type SelectInputEmits,
  type SelectInputModelValue,
  type SelectInputProps,
  type SelectOption,
  type WithElement,
} from '../types';
import {useClickOutside, useCursor, useLanguage, useOpenState, useSelectInputContext} from '../composables';
import {Loader} from './Loader';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<SelectInputProps<T>> & {options?: any; loading?: boolean}>();
const emit = defineEmits<SelectInputEmits<T>>();

const {model, options} = useSelectInputContext(props, emit);
const {translate} = useLanguage();

const selectWrapper = ref<HTMLElement | null>(null);
const optionsWrapper = ref<HTMLElement | null>(null);
const searchRef = ref<HTMLElement | null>(null);
const searchText = ref<string | null>(null);

const currentOption = computed(() => options.value.find((option) => option.value === model.value));
const filteredOptions = computed(() =>
  options.value.filter((option) => {
    return !searchText.value || option.label?.toLowerCase().includes(searchText.value?.toLowerCase() ?? '');
  }),
);

const scrollToCursor = (cursor: number): void => {
  const option = optionsWrapper.value?.children[cursor] as HTMLElement | undefined;

  option?.scrollIntoView({
    block: 'nearest',
    inline: 'nearest',
  });
};

const {cursor, next, previous, reset} = useCursor({
  items: filteredOptions,
  onChange: scrollToCursor,
});

const {isOpen, open, close, toggle} = useOpenState({
  async onOpen() {
    cursor.value = filteredOptions.value.findIndex((option) => option.value === model.value);

    await nextTick();
    scrollToCursor(cursor.value);
  },

  onClose() {
    searchText.value = null;
    reset();
  },
});

watch(searchText, (value) => {
  if (!value) {
    return;
  }

  cursor.value = 0;
});

useClickOutside(selectWrapper, close);

const selectOption = <T1 extends T>(option: SelectOption<T1>) => {
  model.value = option.value;
  close();
};

const selectOptionAtCursor = () => {
  if (!isOpen.value) {
    open();
    return;
  }

  selectOption(filteredOptions.value[cursor.value]);
};

const onPressUp = () => {
  if (isOpen.value) {
    previous();
  } else {
    open();
  }
};

const onPressDown = () => {
  if (isOpen.value) {
    next();
  } else {
    open();
  }
};

const onPressTab = (event: FocusEvent) => {
  if (!isOpen.value) {
    return;
  }

  event.preventDefault();
};
</script>
