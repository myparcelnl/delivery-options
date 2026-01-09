<template>
  <div class="mp-gap-4 mp-grid">
    <CarrierBox
      v-for="[carrier, group] in grouped"
      :key="carrier"
      :carrier="carrier">
      <GroupInput
        :id="carrier"
        :options="group as any">
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
import {toRefs, watch, onMounted, toValue} from 'vue';
import {CarrierBox, type SelectOption, RadioInput} from '@myparcel-dev/do-shared';
import {DeliveryTypeName} from '@myparcel-dev/constants';
import {parseJson} from '../../../../utils';
import {type SelectedDeliveryMoment} from '../../../../types';
import {FIELD_DELIVERY_MOMENT} from '../../../../data';
import {useOptionsGroupedByCarrier, useLanguage, useSelectedValues} from '../../../../composables';
import {GroupInput} from '../../../../components';

interface Props {
  options: SelectOption<string>[];
}

const props = defineProps<Props>();
const propRefs = toRefs(props);

const model = defineModel<string | undefined>({required: true});

const {translate} = useLanguage();
const {grouped} = useOptionsGroupedByCarrier(propRefs.options as any);
const {deliveryDate} = useSelectedValues();

/**
 * Automatically select the first standard delivery moment whenever the selected date changes.
 * This ensures that a default value is set when the component is first rendered.
 */
watch(
  [propRefs.options, deliveryDate],
  () => {
    if (props.options.length === 0) {
      return;
    }

    const resolvedOptions = toValue(props.options);
    const firstStandardDelivery = resolvedOptions.find((option) => {
      return parseJson<SelectedDeliveryMoment>(option.value).deliveryType === DeliveryTypeName.Standard;
    });
    model.value = firstStandardDelivery?.value ?? resolvedOptions[0]?.value;
  },
  {immediate: props.options.length > 0, deep: true},
);
</script>
