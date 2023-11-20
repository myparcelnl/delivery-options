<template>
  <div>
    <MyParcelDeliveryOptions
      v-if="store.configuration"
      :config="parsedConfiguration"
      @update="output = $event" />

    <h2>Output</h2>
    <div>
      <pre v-text="output" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, reactive, ref, toRaw} from 'vue';
import {construct} from 'radash';
import {ComponentName, type DeliveryOptionsConfiguration, type DeliveryOptionsOutput} from '@myparcel-do/shared';
import {MyParcelDeliveryOptions} from '@myparcel/delivery-options/ts';
import {useSandboxStore} from '../stores';
import FormTextInput from './form/FormTextInput.vue';
import FormSelectInput from './form/FormSelectInput.vue';
import FormCheckboxGroupInput from './form/FormCheckboxGroupInput.vue';
import CButton from './CButton.vue';

const output = ref<DeliveryOptionsOutput | null>(null);

const store = useSandboxStore();

const parsedConfiguration = computed(() => {
  return reactive({
    ...construct(store.configuration),
    components: toRaw({
      [ComponentName.Select]: FormSelectInput,
      [ComponentName.Text]: FormTextInput,
      [ComponentName.CheckboxGroup]: FormCheckboxGroupInput,
      [ComponentName.Button]: CButton,
    }),
  }) as DeliveryOptionsConfiguration;
});
</script>
