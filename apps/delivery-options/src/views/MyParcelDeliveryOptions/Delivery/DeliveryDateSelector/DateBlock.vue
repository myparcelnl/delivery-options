<template>
  <div
    :class="{
      'mp-bg-blue-500 mp-border-blue-500': active,
    }"
    :title="formatted.standard"
    class="mp-bg-opacity-20 mp-border mp-flex mp-flex-col mp-items-center mp-p-3 mp-rounded-xl"
    role="button"
    tabindex="0"
    @click="$emit(ElementEvent.Click)">
    <span
      class="mp-not-sr-only"
      v-text="formatted.weekday" />

    <span
      class="mp-not-sr-only mp-text-3xl"
      v-text="formatted.day" />

    <span
      class="mp-not-sr-only"
      v-text="formatted.month" />
  </div>
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {ElementEvent} from '@myparcel-do/shared';
import {useDateFormat} from '../../../../composables';

const props = defineProps<{date: string; active?: boolean}>();
defineEmits<{click: void}>();

const propRefs = toRefs(props);

const formatted = useDateFormat(propRefs.date);
</script>
