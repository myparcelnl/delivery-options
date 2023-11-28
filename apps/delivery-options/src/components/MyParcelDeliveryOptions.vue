<template>
  <DeliveryOptionsForm
    v-if="store.resolvedConfiguration"
    @update="onUpdate" />
</template>

<script lang="ts" setup>
import {toRef, watchEffect} from 'vue';
import {get} from '@vueuse/core';
import {type InternalOutput, useDeliveryOptionsStore} from '@myparcel-do/shared';
import {type DeliveryOptionsEmits, type DeliveryOptionsProps} from '../types';
import {useDeliveryOptionsIncomingEvents, useDeliveryOptionsOutgoingEvents} from '../composables';
import DeliveryOptionsForm from './DeliveryOptionsForm.vue';

const props = defineProps<DeliveryOptionsProps>();
const emit = defineEmits<DeliveryOptionsEmits>();

const configRef = toRef(props, 'config');

const store = useDeliveryOptionsStore();

watchEffect(() => {
  const value = get(get(configRef.value));

  if (!value) {
    return;
  }

  store.updateConfiguration(value);
});

const onUpdate = (values: InternalOutput) => {
  store.updateOutput(values);
};

useDeliveryOptionsIncomingEvents();
useDeliveryOptionsOutgoingEvents(emit);
</script>
