<template>
  <Location.Component />
</template>

<script lang="ts" setup>
import {TextInput} from '@myparcel-dev/shared';
import {createField} from '@myparcel/vue-form-builder';
import {FIELD_PICKUP_LOCATION} from '../../../../data';
import {useSelectedValues} from '../../../../composables';

const {pickupLocation} = useSelectedValues();

// eslint-disable-next-line @typescript-eslint/naming-convention
const Location = createField({
  name: FIELD_PICKUP_LOCATION,
  ref: pickupLocation,
  component: TextInput,
  attributes: {type: 'hidden'},
});
</script>
