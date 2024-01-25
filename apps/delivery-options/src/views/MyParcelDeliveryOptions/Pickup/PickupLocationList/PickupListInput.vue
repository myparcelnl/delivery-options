<template>
  <div class="mp-gap-4 mp-grid mp-grid-flow-row">
    <PickupLocationCarrierGroup
      v-for="[carrier, group] in grouped"
      :key="carrier"
      :carrier="carrier"
      :options="group" />
  </div>
</template>

<script generic="T" lang="ts" setup>
import {toRefs} from 'vue';
import {type RadioGroupProps, type WithElement} from '@myparcel-do/shared';
import {useOptionsGroupedByCarrier} from '../../../../composables';
import PickupLocationCarrierGroup from './PickupLocationCarrierGroup.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<RadioGroupProps<T>>>();
const propRefs = toRefs(props);

const {grouped} = useOptionsGroupedByCarrier(propRefs.element);
</script>
