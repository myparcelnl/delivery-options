<template>
  <ListOrMap.Component>
    <template #content="{option}">
      <KeepAlive>
        <component
          :is="currentComponent"
          v-if="value === option.value"
          class="mp-pl-4 mp-pt-4" />
      </KeepAlive>
    </template>
  </ListOrMap.Component>
</template>

<script lang="ts" setup>
import {computed, h, ref} from 'vue';
import {get} from '@vueuse/core';
import {PICKUP_LOCATIONS_VIEWS_LIST, PICKUP_LOCATIONS_VIEWS_MAP, type SelectOption} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {FIELD_HOME_OR_PICKUP} from '../../../constants';
import {RadioGroupInput} from '../../../components';
import PickupLocationList from './PickupLocationList/PickupLocationList.vue';

const value = ref();

// eslint-disable-next-line @typescript-eslint/naming-convention
const ListOrMap = createField({
  name: FIELD_HOME_OR_PICKUP,
  component: RadioGroupInput,
  ref: value,
  props: {
    options: [
      {value: PICKUP_LOCATIONS_VIEWS_LIST, label: PICKUP_LOCATIONS_VIEWS_LIST},
      {value: PICKUP_LOCATIONS_VIEWS_MAP, label: PICKUP_LOCATIONS_VIEWS_MAP},
    ] satisfies SelectOption[],
  },
});

const currentComponent = computed(() => {
  const current = get(ListOrMap.ref);

  return current === PICKUP_LOCATIONS_VIEWS_LIST ? PickupLocationList : h('div');
});
</script>
