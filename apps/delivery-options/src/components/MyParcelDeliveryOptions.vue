<template>
  <DeliveryOptionsForm
    v-if="config"
    :config="mutableConfig"
    @update="update" />
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useEventListener} from '@vueuse/core';
import {
  type DeliveryOptionsConfiguration,
  type DeliveryOptionsOutput,
  UPDATE_CONFIG_IN,
  UPDATE_DELIVERY_OPTIONS,
  UPDATED_DELIVERY_OPTIONS,
  useDeliveryOptionsConfig,
} from '@myparcel-do/shared';
import {isOfType} from '@myparcel/ts-utils';
import DeliveryOptionsForm from './DeliveryOptionsForm.vue';

const props = defineProps<{config?: DeliveryOptionsConfiguration}>();
const emit = defineEmits<(event: 'update', values: DeliveryOptionsOutput) => void>();

const mutableConfig = ref({...props.config});
const deliveryOptionsConfig = useDeliveryOptionsConfig();

const updateConfig = (event: Event | CustomEvent) => {
  const newConfig: DeliveryOptionsConfiguration = isOfType<CustomEvent>(event, 'detail')
    ? event.detail
    : window.MyParcelConfig;

  deliveryOptionsConfig.update(newConfig);
};

useEventListener(document, UPDATE_DELIVERY_OPTIONS, updateConfig);
useEventListener(document, UPDATE_CONFIG_IN, updateConfig);

const update = (values: DeliveryOptionsOutput) => {
  document.dispatchEvent(new CustomEvent(UPDATED_DELIVERY_OPTIONS, {detail: values}));
  emit('update', values);
};
</script>
