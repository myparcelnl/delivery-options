<template>
  <DeliveryOptionsForm
    v-if="config"
    :config="config"
    @update="update" />
</template>

<script lang="ts" setup>
import {computed, watch} from 'vue';
import {get, type MaybeRef, toRefs, useEventListener} from '@vueuse/core';
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

const props = defineProps<{config?: MaybeRef<DeliveryOptionsConfiguration>}>();
const emit = defineEmits<(event: 'update', values: DeliveryOptionsOutput) => void>();

const propRefs = toRefs(props);

const store = useDeliveryOptionsStore();

const resolvedConfig = computed(() => {
  if (propRefs.config) {
    return propRefs.config.value;
  }

  return window.MyParcelConfig;
});

console.log('sneet', store.configuration);

watch(
  propRefs.config,
  (configuration) => {
    const value = get(get(configuration));

    if (!value) {
      return;
    }

    console.log('config', value);
    store.updateConfiguration(value);
  },
  {deep: true},
);

const updateConfig = (event: Event | CustomEvent) => {
  const newConfig: DeliveryOptionsConfiguration = isOfType<CustomEvent>(event, 'detail')
    ? event.detail
    : window.MyParcelConfig;

  store.updateConfiguration(newConfig);
};

useEventListener(document, UPDATE_DELIVERY_OPTIONS, updateConfig);
useEventListener(document, UPDATE_CONFIG_IN, updateConfig);

const update = (values: DeliveryOptionsOutput) => {
  document.dispatchEvent(new CustomEvent(UPDATED_DELIVERY_OPTIONS, {detail: values}));
  emit('update', values);
};
</script>
