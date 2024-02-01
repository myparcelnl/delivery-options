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
          <span v-text="option.label" />

          <EcoFriendlyLabel
            v-if="option.ecoFriendly"
            :id="carrier"
            :amount="option.ecoFriendly" />

          <PriceTag
            v-if="option.price"
            :price="option.price"
            class="mp-ml-auto" />
        </template>
      </GroupInput>
    </CarrierBox>
  </div>
</template>

<script generic="T" lang="ts" setup>
import {toRefs, toValue, watch} from 'vue';
import {useVModel} from '@vueuse/core';
import {
  CarrierBox,
  type RadioGroupEmits,
  type RadioGroupProps,
  RadioInput,
  type WithElement,
} from '@myparcel-do/shared';
import {FIELD_DELIVERY_MOMENT} from '../../../../data';
import {useOptionsGroupedByCarrier, useSelectedDeliveryDate} from '../../../../composables';
import PriceTag from '../../../../components/common/PriceTag/PriceTag.vue';
import EcoFriendlyLabel from '../../../../components/common/EcoFriendlyLabel/EcoFriendlyLabel.vue'; // eslint-disable-next-line vue/no-unused-properties
import {GroupInput} from '../../../../components';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<RadioGroupProps<T>>>();
const emit = defineEmits<RadioGroupEmits<T>>();
const propRefs = toRefs(props);

const model = useVModel(props, undefined, emit);

const date = useSelectedDeliveryDate();

const {options, grouped} = useOptionsGroupedByCarrier(propRefs.element);

watch(
  date,
  () => {
    const [first] = toValue(options);

    model.value = first.value;
  },
  {immediate: options.value.length > 0},
);
</script>
