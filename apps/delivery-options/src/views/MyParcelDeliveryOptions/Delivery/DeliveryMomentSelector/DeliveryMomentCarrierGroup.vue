<template>
  <div class="mp-border mp-p-4 mp-rounded-xl">
    <div
      v-if="fullCarrier"
      class="mp-flex mp-gap-2 mp-items-center mp-pb-2">
      <CarrierLogo
        :carrier="fullCarrier.name"
        small />

      <b
        class="mp-font-bold"
        v-text="fullCarrier.human" />
    </div>

    <GroupInput
      :id="carrier"
      :options="options">
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
  </div>
</template>

<script generic="T" lang="ts" setup>
import {toRefs} from 'vue';
import {useVModel} from '@vueuse/core';
import {
  CarrierLogo,
  type RadioGroupEmits,
  type RadioGroupProps,
  RadioInput,
  type SelectOption,
} from '@myparcel-do/shared';
import {type CarrierName} from '@myparcel/constants';
import {FIELD_DELIVERY_MOMENT} from '../../../../data';
import {useResolvedCarrier} from '../../../../composables';
import PriceTag from '../../../../components/common/PriceTag/PriceTag.vue';
import EcoFriendlyLabel from '../../../../components/common/EcoFriendlyLabel/EcoFriendlyLabel.vue';
import {GroupInput} from '../../../../components';

const props = defineProps<
  // eslint-disable-next-line vue/no-unused-properties
  RadioGroupProps<string> & {
    carrier: CarrierName;
    options: SelectOption<T>[];
  }
>();
const emit = defineEmits<RadioGroupEmits<string>>();
const propRefs = toRefs(props);

const model = useVModel(props, undefined, emit);

const fullCarrier = useResolvedCarrier(propRefs.carrier);
</script>
