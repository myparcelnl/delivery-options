<template>
  <Location.Component />
</template>

<script lang="ts" setup>
import {TextInput} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {FIELD_PICKUP_LOCATION} from '../../../../data';
import {useSelectedPickupLocation} from '../../../../composables';

const {model} = useSelectedPickupLocation();

// eslint-disable-next-line @typescript-eslint/naming-convention
const Location = createField({
  name: FIELD_PICKUP_LOCATION,
  ref: model,
  component: TextInput,
  attributes: {type: 'hidden'},
});
</script>
