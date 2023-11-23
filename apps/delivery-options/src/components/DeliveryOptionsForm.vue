<template>
  <Form.Component>
    <HomeOrPickup.Component />
  </Form.Component>
</template>

<script lang="ts" setup>
import {computed, markRaw, reactive, watch} from 'vue';
import {type InternalOutput, useLanguage} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {createDeliveryOptionsForm} from '../form/createDeliveryOptionsForm';
import RadioGroupTabs from './RadioGroupTabs.vue';
import PickupLocations from './PickupLocations.vue';
import HomeDelivery from './HomeDelivery.vue';

const emit = defineEmits<(event: 'update', values: InternalOutput) => void>();

// eslint-disable-next-line @typescript-eslint/naming-convention
const Form = createDeliveryOptionsForm();

const values = computed<InternalOutput>(() => Form.instance?.getValues());

watch(values, (values) => {
  emit('update', values);
});

const {translate} = useLanguage();

const HomeOrPickup = createField({
  name: 'homeOrPickup',
  component: RadioGroupTabs,
  props: reactive({
    options: [
      {
        label: translate('homeDelivery'),
        value: 'home',
        content: markRaw(HomeDelivery),
      },
      {
        label: translate('pickup'),
        value: 'pickup',
        content: markRaw(PickupLocations),
      },
    ],
  }),
});
</script>
