<template>
  <Box>
    <h2 v-text="translate('address')" />

    <div class="mp-grid mp-gap-4">
      <!-- Preset Addresses -->
      <div class="mp-grid mp-gap-2 mp-grid-cols-2">
        <AddressPresetBox
          v-for="address in addresses"
          :key="address[AddressField.Country]"
          v-model="selectedAddress"
          :address="address" />

        <Box
          v-if="hasMore"
          class="mp-flex mp-items-center mp-justify-center">
          <button
            class="mp-text-blue-500 hover:mp-text-blue-700 mp-underline"
            @click="loadMore">{{ translate('more') }}</button>
        </Box>
      </div>

      <!-- Custom Address Toggle -->
      <Box
        is="label"
        :class="{
          'mp-bg-monstera-100 mp-border-monstera-200 dark:mp-bg-monstera-800 dark:mp-border-monstera-600':
            isCustom,
        }">
        <h3>
          <RadioInput
            v-model="selectedAddress"
            :value="customValue"
            name="address" />

          {{ translate('address_custom') }}
        </h3>

        <!-- Custom Address Fields -->
        <div
          v-if="isCustom"
          class="mp-mt-4 mp-grid mp-gap-4">

          <div class="mp-grid mp-gap-2 mp-grid-cols-2">
            <div>
              <label
                class="mp-block mp-text-sm mp-font-medium mp-mb-1"
                v-text="translate(AddressField.Country)" />
              <FormTextInput v-model="address[AddressField.Country]" />
            </div>

            <div>
              <label
                class="mp-block mp-text-sm mp-font-medium mp-mb-1"
                v-text="translate(AddressField.PostalCode)" />
              <FormTextInput v-model="address[AddressField.PostalCode]" />
            </div>
          </div>

          <div class="mp-grid mp-gap-2 mp-grid-cols-2">
            <div>
              <label
                class="mp-block mp-text-sm mp-font-medium mp-mb-1"
                v-text="translate(AddressField.Street)" />
              <FormTextInput v-model="address[AddressField.Street]" />
            </div>

            <div>
              <label
                class="mp-block mp-text-sm mp-font-medium mp-mb-1"
                v-text="translate(AddressField.City)" />
              <FormTextInput v-model="address[AddressField.City]" />
            </div>
          </div>

        </div>
      </Box>
    </div>
  </Box>
</template>

<script lang="ts" setup>
import {storeToRefs} from 'pinia';
import {AddressField, RadioInput} from '@myparcel-dev/do-shared';
import {useLanguage} from '../composables';
import {useAddressSelector} from '../composables/useAddressSelector';
import {useSandboxStore} from '../stores/useSandboxStore';
import {Box} from './Box';
import AddressPresetBox from './AddressPresetBox.vue';
import FormTextInput from './form/input/FormTextInput.vue';

const {translate} = useLanguage();
const sandboxStore = useSandboxStore();
const {address} = storeToRefs(sandboxStore);

const {
  addresses,
  customValue,
  hasMore,
  isCustom,
  selectedAddress,
  loadMore,
} = useAddressSelector();
</script>
