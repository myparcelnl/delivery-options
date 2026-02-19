<template>
  <div
    v-show="show"
    ref="wrapper">
    <Suspense>
      <DeliveryOptionsForm
        v-if="ready"
        v-show="!hasExceptions"
        class="myparcel-delivery-options" />
    </Suspense>

    <KeepAlive>
      <Errors v-if="hasExceptions" />
    </KeepAlive>
  </div>
</template>

<script lang="ts" setup>
import '../../assets/index.scss';
import {computed, onMounted, ref, toRefs, watch, toValue} from 'vue';
import {useEventListener} from '@vueuse/core';
import {useLogger, useApiExceptions} from '@myparcel-dev/do-shared';
import {getConfigFromWindow} from '../../utils';
import {type DeliveryOptionsEmits, type DeliveryOptionsProps} from '../../types';
import {useAddressStore, useConfigStore} from '../../stores';
import {HIDE_DELIVERY_OPTIONS, SHOW_DELIVERY_OPTIONS} from '../../data';
import {setConfiguration} from '../../config';
import {
  useDeliveryOptionsIncomingEvents,
  useDeliveryOptionsOutgoingEvents,
  useProvideElementWidth,
} from '../../composables';
import Errors from './Errors.vue';
import DeliveryOptionsForm from './DeliveryOptionsForm/DeliveryOptionsForm.vue';

const props = defineProps<DeliveryOptionsProps>();
const emit = defineEmits<DeliveryOptionsEmits>();

const propRefs = toRefs(props);

const logger = useLogger();
const {state: config} = useConfigStore();
const {state: address} = useAddressStore();

const wrapper = ref<HTMLFormElement>();

const {hasExceptions} = useApiExceptions();

const ready = computed(() => Boolean(address.cc));

const show = ref(true);

onMounted(() => {
  if (propRefs.configuration?.value) {
    if (import.meta.env.DEV) {
      logger.debug('Using config from props');
    }

    return;
  }

  if (!window.MyParcelConfig) {
    if (import.meta.env.DEV) {
      logger.error('No config found');
    }

    return;
  }

  if (import.meta.env.DEV) {
    logger.debug('Using config from window');
  }

  setConfiguration(getConfigFromWindow());
});

watch(
  propRefs.configuration,
  (value) => {
    const resolvedValue = toValue(value);

    if (!resolvedValue) {
      return;
    }

    setConfiguration(resolvedValue);
  },
  {immediate: true, deep: true},
);

useDeliveryOptionsIncomingEvents();
useDeliveryOptionsOutgoingEvents(emit);

useProvideElementWidth(wrapper);

useEventListener(document, SHOW_DELIVERY_OPTIONS, () => {
  show.value = true;
});

useEventListener(document, HIDE_DELIVERY_OPTIONS, () => {
  show.value = false;
});
</script>
