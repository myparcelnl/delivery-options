<template>
  <DeliveryMoment.Component v-if="DeliveryMoment" />
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import {ComponentName, type SelectOption} from '@myparcel-do/shared';
import {createField, type ModularCreatedField, useForm} from '@myparcel/vue-form-builder';
import {getComponent} from '../utils';
import {useResolvedDeliveryOptions} from '../composables';

// eslint-disable-next-line @typescript-eslint/naming-convention
const DeliveryMoment = ref<ModularCreatedField | null>(null);

const form = useForm();

const deliveryMoments = useResolvedDeliveryOptions();

const deliveryDate = computed(() => form.getValues()?.deliveryDate);

watch(deliveryDate, () => {
  if (!deliveryDate.value || !deliveryMoments.value) {
    return;
  }

  DeliveryMoment.value = createField({
    name: 'deliveryMoment',
    component: getComponent(ComponentName.RadioGroup),
    props: {
      options: deliveryMoments.value
        .filter((option) => option.date === deliveryDate.value)
        .map((option) => {
          return {
            carrier: option.carrier.identifier,
            label: option.time,
            value: {
              carrier: option.carrier.identifier,
              date: option.date,
              deliveryType: option.deliveryType,
              packageType: option.packageType,
            },
          };
        }) satisfies SelectOption[],
    },
  });
});
</script>
