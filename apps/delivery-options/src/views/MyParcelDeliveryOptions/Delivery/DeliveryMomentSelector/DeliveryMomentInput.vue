<template>
  <div class="mp-gap-4 mp-grid">
    <CarrierBox
      v-for="[carrier, group] in grouped"
      :key="carrier"
      :carrier="carrier">
      <GroupInput
        :id="carrier"
        :options="group">
        <template #input="{option}">
          <RadioInput
            v-model="model"
            :name="FIELD_DELIVERY_MOMENT"
            :value="option.value"
            type="radio" />
        </template>

        <template #default="{option}">
          <span v-text="translate(option.label)" />
        </template>
      </GroupInput>
    </CarrierBox>
  </div>
</template>

<script lang="ts" setup>
import {toRefs, watch, onMounted} from 'vue';
import {useVModel} from '@vueuse/core';
import {
  CarrierBox,
  type RadioGroupEmits,
  type RadioGroupProps,
  RadioInput,
  type WithElement,
} from '@myparcel-do/shared';
import {FIELD_DELIVERY_MOMENT} from '../../../../data';
import {
  useOptionsGroupedByCarrier,
  useLanguage,
  useSelectedValues,
} from '../../../../composables';
import {GroupInput} from '../../../../components';

const props = defineProps<WithElement<RadioGroupProps>>();
const emit = defineEmits<RadioGroupEmits>();
const propRefs = toRefs(props);

const model = useVModel(props, undefined, emit);

const {translate} = useLanguage();
const {options, grouped} = useOptionsGroupedByCarrier<string>(propRefs.element);
const {deliveryMoment, clearSelectedValues} = useSelectedValues();

watch(
  options,
  () => {
    model.value = undefined;
  },
  {immediate: true, deep: true},
);

onMounted(() => {
  document.addEventListener('myparcel_unselect_delivery_options', () => {
    model.value = undefined;
  });
});
</script>
