<template>
  <DeliveryOptionsForm
    v-if="store.configuration"
    :config="store.configuration"
    @update="onUpdate" />
</template>

<script lang="ts" setup>
import {toRef, watchEffect} from 'vue';
import {get} from '@vueuse/core';
import {useDeliveryOptionsStore} from '@myparcel-do/shared';
import {type DeliveryOptionsEmits, type DeliveryOptionsProps} from '../types/components.types';
import {useUpdateDeliveryOptions} from '../composables/useUpdateDeliveryOptions';
import {useEmitDeliveryOptionsEvents} from '../composables/useEmitDeliveryOptionsEvents';
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

const onUpdate = useUpdateDeliveryOptions(emit);

useEmitDeliveryOptionsEvents();
</script>
