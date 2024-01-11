<template>
  <b
    class="mp-block"
    v-text="translate(OPENING_HOURS)" />

  <div
    v-for="hours in filteredOpeningHours"
    :key="hours.weekday"
    class="mp-content-between mp-gap-1 mp-grid mp-grid-cols-2">
    <span v-text="hours.weekday" />
    <span
      class="mp-text-nowrap"
      v-text="hours.timeString" />
  </div>

  <DoButton
    v-if="!showAll"
    link
    @click="showAll = true">
    {{ translate(SHOW_MORE_HOURS) }}
  </DoButton>
</template>

<script lang="ts" setup>
import {computed, onDeactivated, ref, toRefs} from 'vue';
import {OPENING_HOURS, SHOW_MORE_HOURS} from '@myparcel-do/shared';
import {SHOWN_OPENING_HOURS} from '../../../../data';
import {usePickupLocation} from '../../../../composables/usePickupLocation';
import {useLanguage} from '../../../../composables';
import DoButton from '../../../../components/common/DoButton/DoButton.vue';

const props = defineProps<{pickupLocation: string}>();
const propRefs = toRefs(props);

const {translate} = useLanguage();

const showAll = ref(false);

const {openingHours} = usePickupLocation(propRefs.pickupLocation);

const filteredOpeningHours = computed(() => {
  return showAll.value ? openingHours.value : openingHours.value.slice(0, SHOWN_OPENING_HOURS);
});

onDeactivated(() => {
  showAll.value = false;
});
</script>
