<template>
  <div
    :class="{
      'mp-bg-blue-500 mp-border-blue-500': active,
      [LOADER_CLASSES.join(' ')]: !date,
      'mp-bg-opacity-20 mp-border': date,
    }"
    :role="date ? 'button' : undefined"
    :tabindex="date ? 0 : undefined"
    :title="date ? standard : undefined"
    class="mp-flex mp-flex-col mp-items-center mp-p-3 mp-rounded-xl"
    @click="() => (date ? $emit(ElementEvent.Click) : null)">
    <span
      class="mp-not-sr-only"
      v-text="date ? weekday : NBSP" />

    <span
      class="mp-not-sr-only mp-text-3xl"
      v-text="date ? day : NBSP" />

    <span
      class="mp-not-sr-only"
      v-text="date ? month : NBSP" />
  </div>
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {type DateLike} from '@vueuse/core';
import {ElementEvent, LOADER_CLASSES, NBSP} from '@myparcel-do/shared';
import {useDateFormat} from '../../../../composables';

const props = defineProps<{date?: DateLike; active?: boolean}>();
defineEmits<{click: void}>();

const propRefs = toRefs(props);

const {standard, weekday, day, month} = useDateFormat(propRefs.date);
</script>
