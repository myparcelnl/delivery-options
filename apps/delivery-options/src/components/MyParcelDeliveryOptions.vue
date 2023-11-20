<template>
  <DeliveryOptionsForm
    v-if="store.configuration"
    :config="store.configuration"
    @update="update" />
</template>

<script lang="ts" setup>
import {toRef, watchEffect} from 'vue';
import {get, type MaybeRef, useEventListener} from '@vueuse/core';
import {
  type DeliveryOptionsConfiguration,
  type DeliveryOptionsOutput,
  UPDATE_CONFIG_IN,
  UPDATE_DELIVERY_OPTIONS,
  UPDATED_DELIVERY_OPTIONS,
  useDeliveryOptionsStore,
} from '@myparcel-do/shared';
import {isOfType} from '@myparcel/ts-utils';
import DeliveryOptionsForm from './DeliveryOptionsForm.vue';

const props = defineProps<{
  config?: MaybeRef<DeliveryOptionsConfiguration>;
}>();
const emit = defineEmits<(event: 'update', values: DeliveryOptionsOutput) => void>();

const configRef = toRef(props, 'config');

const store = useDeliveryOptionsStore();

watchEffect(() => {
  const value = get(get(configRef.value));

  if (!value) {
    return;
  }

  store.updateConfiguration(value);
});

const updateConfigFromEvent = (event: Event | CustomEvent) => {
  const newConfig: DeliveryOptionsConfiguration = isOfType<CustomEvent>(event, 'detail')
    ? event.detail
    : window.MyParcelConfig;

  store.updateConfiguration(newConfig);
};

useEventListener(document, UPDATE_DELIVERY_OPTIONS, updateConfigFromEvent);
useEventListener(document, UPDATE_CONFIG_IN, updateConfigFromEvent);

const update = (values: DeliveryOptionsOutput) => {
  document.dispatchEvent(new CustomEvent(UPDATED_DELIVERY_OPTIONS, {detail: values}));
  emit('update', values);
};
</script>
