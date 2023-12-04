<template>
  <Form.Component>
    <HomeOrPickup.Component />
  </Form.Component>
</template>

<script lang="ts" setup>
import {computed, markRaw, watch} from 'vue';
import {get} from '@vueuse/core';
import {type InternalOutput} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {useConfigStore} from '../stores';
import {createDeliveryOptionsForm} from '../form';
import {useActiveCarriers, useLanguage} from '../composables';
import RadioGroupTabs from './RadioGroupTabs.vue';
import PickupLocations from './PickupLocations.vue';
import HomeDelivery from './HomeDelivery.vue';

const emit = defineEmits<(event: 'update', values: InternalOutput) => void>();

// eslint-disable-next-line @typescript-eslint/naming-convention
const Form = createDeliveryOptionsForm();

watch(Form.instance.values, (value) => {
  emit('update', value as InternalOutput);
});

const {translate} = useLanguage();

const config = useConfigStore();

const carriers = useActiveCarriers();

// eslint-disable-next-line @typescript-eslint/naming-convention
const HomeOrPickup = createField({
  name: 'homeOrPickup',
  component: RadioGroupTabs,
  props: {
    options: computed(() => {
      const options = [];
      const resolvedCarriers = get(carriers) ?? [];

      if (resolvedCarriers.some((carrier) => get(carrier.hasDelivery))) {
        options.push({
          label: translate('homeDelivery'),
          value: 'home',
          content: markRaw(HomeDelivery),
        });
      }

      if (resolvedCarriers.some((carrier) => get(carrier.hasPickup))) {
        options.push({
          label: translate('pickup'),
          value: 'pickup',
          content: markRaw(PickupLocations),
        });
      }

      return options;
    }),
  },
});
</script>
