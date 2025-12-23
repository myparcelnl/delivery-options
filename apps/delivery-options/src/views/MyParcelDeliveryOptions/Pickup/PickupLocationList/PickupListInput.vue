<template>
  <div class="mp-gap-4 mp-grid">
    <PickupLocationCarrierGroup
      v-for="[carrier, group] in grouped"
      :key="carrier"
      :carrier="carrier"
      :options="group" />
  </div>
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {type MakeRequired, type SelectOption} from '@myparcel-dev/do-shared';
import {useOptionsGroupedByCarrier} from '../../../../composables';
import PickupLocationCarrierGroup from './PickupLocationCarrierGroup.vue';

interface Props {
  modelValue?: string;
  loading?: boolean;
  options: MakeRequired<SelectOption<string>, 'carrier'>[];
}

const props = defineProps<Props>();
const propRefs = toRefs(props);

const {grouped} = useOptionsGroupedByCarrier(propRefs.options);
</script>
