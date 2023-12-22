<template>
  <OptionRowLoader
    v-show="loading"
    :rows="2"
    price>
    <Loader.Base class="mp-h-3 mp-rounded-sm mp-w-3" />
  </OptionRowLoader>

  <ShipmentOptions.Component v-show="!loading" />
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {Loader} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {createShipmentOptionsFromDeliveryMoment} from '../../../../utils';
import {FIELD_SHIPMENT_OPTIONS} from '../../../../data';
import {useSelectedDeliveryMoment} from '../../../../composables';
import OptionRowLoader from '../../../../components/form/GroupInput/GroupInputLoader.vue';
import {CheckboxGroupInput} from '../../../../components';

const deliveryMoment = useSelectedDeliveryMoment();

const loading = computed(() => !deliveryMoment.value);

// eslint-disable-next-line @typescript-eslint/naming-convention
const ShipmentOptions = createField({
  name: FIELD_SHIPMENT_OPTIONS,
  component: CheckboxGroupInput,
  ref: ref([]),
  props: {
    options: computed(() => {
      if (!deliveryMoment.value) {
        return [];
      }

      return createShipmentOptionsFromDeliveryMoment(deliveryMoment.value);
    }),
  },
});
</script>
