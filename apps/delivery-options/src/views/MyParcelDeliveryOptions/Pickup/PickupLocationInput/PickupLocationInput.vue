<template>
  <input
    v-model="pickupLocation"
    :name="FIELD_PICKUP_LOCATION"
    type="hidden" />
</template>

<script lang="ts" setup>
import {FIELD_PICKUP_LOCATION} from '../../../../data';
import {useSelectedValues} from '../../../../composables';

const {pickupLocation} = useSelectedValues();
</script>
