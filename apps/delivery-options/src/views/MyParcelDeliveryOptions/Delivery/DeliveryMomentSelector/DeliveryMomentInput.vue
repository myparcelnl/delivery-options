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
import {computed, toRefs, watch, toValue} from 'vue';
import {CarrierBox, type SelectOption, RadioInput} from '@myparcel-dev/do-shared';
import {DeliveryTypeName} from '@myparcel-dev/constants';
import {parseJson} from '../../../../utils';
import {type SelectedDeliveryMoment} from '../../../../types';
import {useConfigStore} from '../../../../stores';
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
const {state: config} = useConfigStore();
const {deliveryDate, carrier} = useSelectedValues();

/**
 * In compact-view mode, only show options for the carrier the user picked from the
 * compact list. Outside compact mode, show all carriers as before.
 */
const visibleOptions = computed(() => {
  if (config.compactView && carrier.value) {
    const selected = carrier.value;
    return propRefs.options.value.filter(
      (option) => parseJson<SelectedDeliveryMoment>(option.value).carrier === selected,
    );
  }

  return propRefs.options.value;
});

const {grouped} = useOptionsGroupedByCarrier(visibleOptions as any);

/**
 * Automatically select the first standard delivery moment whenever the selected date changes.
 * Prefers a moment for the pre-selected carrier when one exists, so that compact-view
 * selections survive into the home flow.
 */
watch(
  [visibleOptions, deliveryDate],
  () => {
    const resolvedOptions = toValue(visibleOptions);

    if (resolvedOptions.length === 0) {
      return;
    }

    const preferredCarrier = carrier.value;

    const matches = (option: SelectOption<string>, predicate: (parsed: SelectedDeliveryMoment) => boolean) => {
      return predicate(parseJson<SelectedDeliveryMoment>(option.value));
    };

    const carrierStandard = preferredCarrier
      ? resolvedOptions.find((option) =>
          matches(
            option,
            (parsed) => parsed.carrier === preferredCarrier && parsed.deliveryType === DeliveryTypeName.Standard,
          ),
        )
      : undefined;

    const carrierAny = preferredCarrier
      ? resolvedOptions.find((option) => matches(option, (parsed) => parsed.carrier === preferredCarrier))
      : undefined;

    const firstStandard = resolvedOptions.find((option) =>
      matches(option, (parsed) => parsed.deliveryType === DeliveryTypeName.Standard),
    );

    model.value = (carrierStandard ?? carrierAny ?? firstStandard)?.value ?? resolvedOptions[0]?.value;
  },
  {immediate: visibleOptions.value.length > 0, deep: true},
);
</script>
