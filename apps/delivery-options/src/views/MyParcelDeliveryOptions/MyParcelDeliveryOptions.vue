<template>
  <div
    v-show="show"
    ref="wrapper">
    <DeliveryOptionsForm
      v-if="ready"
      class="myparcel-delivery-options" />
  </div>
</template>

<script lang="ts" setup>
import '../../assets/index.scss';
import {computed, onMounted, ref, toRefs, watch} from 'vue';
import {get, useEventListener} from '@vueuse/core';
import {useLogger} from '@myparcel-do/shared';
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
import DeliveryOptionsForm from './DeliveryOptionsForm/DeliveryOptionsForm.vue';

const props = defineProps<DeliveryOptionsProps>();
const emit = defineEmits<DeliveryOptionsEmits>();

const propRefs = toRefs(props);

const logger = useLogger();
const config = useConfigStore();
const address = useAddressStore();

const wrapper = ref<HTMLFormElement>();

const ready = computed(() => Boolean(config.platform && address.cc));

const show = ref(true);

onMounted(() => {
  if (propRefs.configuration?.value) {
    if (import.meta.env.DEV) logger.debug('Using config from props');

    return;
  }

  if (!window.MyParcelConfig) {
    if (import.meta.env.DEV) logger.error('No config found');

    return;
  }

  if (import.meta.env.DEV) logger.debug('Using config from window');

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
useDeliveryOptionsOutgoingEvents(emit);

useProvideElementWidth(wrapper);

useEventListener(document, SHOW_DELIVERY_OPTIONS, () => {
  show.value = true;
});

useEventListener(document, HIDE_DELIVERY_OPTIONS, () => {
  show.value = false;
});
</script>
