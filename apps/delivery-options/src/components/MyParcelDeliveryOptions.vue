<template>
  <div>
    <Form.Component>
      <DeliveryType.Component />
      <DeliveryDate.Component />
      <DeliveryMoment.Component />
    </Form.Component>
  </div>
</template>

<script lang="ts" setup>
import {createField, createForm} from '@myparcel/vue-form-builder';
import SelectInput from './form/SelectInput.vue';
import RadioGroupInput from './form/RadioGroupInput.vue';

const Form = createForm('DeliveryOptions', {});

const DeliveryType = createField({
  name: 'DeliveryType',
  components: RadioGroupInput,
  props: {
    options: [
      {
        label: 'Home',
        value: 'home',
      },
      {
        label: 'Pickup',
        value: 'pickup',
      },
    ],
  },
});

const DeliveryDate = createField({
  name: 'DeliveryDate',
  component: SelectInput,
  props: {
    options: [
      {
        label: 'Today',
        value: 'today',
      },
      {
        label: 'Tomorrow',
        value: 'tomorrow',
      },
    ],
  },
});

const DeliveryMoment = createField({
  name: 'DeliveryMoment',
  component: RadioGroupInput,
  props: {
    options: [
      {
        label: 'Morning',
        value: 'morning',
      },
      {
        label: 'Afternoon',
        value: 'afternoon',
      },
    ],
  },
});
</script>
