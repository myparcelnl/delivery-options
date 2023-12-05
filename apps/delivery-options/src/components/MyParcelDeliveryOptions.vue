<template>
  <DeliveryOptionsForm
    v-if="ready"
    @update="emitChange" />
</template>

<script lang="ts" setup>
import {computed, onMounted, toRefs, watch} from 'vue';
import {get} from '@vueuse/core';
import {useLogger} from '@myparcel-do/shared';
import {getConfigFromWindow, setConfiguration} from '../utils';
import {type DeliveryOptionsEmits, type DeliveryOptionsProps} from '../types';
import {useAddressStore, useConfigStore} from '../stores';
import {useDeliveryOptionsIncomingEvents, useDeliveryOptionsOutgoingEvents} from '../composables';
import DeliveryOptionsForm from './DeliveryOptionsForm.vue';

const props = defineProps<DeliveryOptionsProps>();
const emit = defineEmits<DeliveryOptionsEmits>();

const propRefs = toRefs(props);

const logger = useLogger();
const config = useConfigStore();
const address = useAddressStore();

const ready = computed(() => {
  const isReady = Boolean(config.platform && address.cc);

  logger.debug(`Ready: ${isReady}`);
  return isReady;
});

onMounted(() => {
  if (propRefs.configuration?.value) {
    logger.debug('Using config from props');
    return;
  }

  if (!window.MyParcelConfig) {
    logger.error('No config found :(');
    return;
  }

  logger.debug('Using config from window');

  setConfiguration(getConfigFromWindow());
});

watch(
  propRefs.configuration,
  (value) => {
    const resolvedValue = get(value);

    if (!resolvedValue) {
      return;
    }

    setConfiguration(resolvedValue);
  },
  {immediate: true},
);

useDeliveryOptionsIncomingEvents();

const emitChange = useDeliveryOptionsOutgoingEvents(emit);
</script>
