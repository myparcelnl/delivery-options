<template>
  <input
    :name="FIELD_PICKUP_LOCATION"
    v-model="pickupLocation"
    type="hidden" />
</template>

<script lang="ts" setup>
import {FIELD_PICKUP_LOCATION} from '../../../../data';
import {useSelectedValues} from '../../../../composables';

const {pickupLocation} = useSelectedValues();
</script>
