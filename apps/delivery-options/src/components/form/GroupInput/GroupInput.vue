<template>
  <div>
    <template
      v-for="option in options"
      :key="`${id}-${option.value}`">
      <label class="mp-flex mp-gap-2 mp-items-center mp-py-1">
        <span>
          <slot
            :option="option"
            name="input" />
        </span>

        <slot :option="option">
          <span v-text="translate(option.label)" />
        </slot>

        <EcoFriendlyLabel
          v-if="option.ecoFriendly"
          :id="id"
          :amount="option.ecoFriendly" />

        <PriceTag
          v-if="option.price !== undefined"
          :price="option.price"
          class="mp-ml-auto" />
      </label>

      <div>
        <slot
          :option="option"
          name="content" />
      </div>
    </template>
  </div>
</template>

<script generic="T extends SelectOptionValue" lang="ts" setup>
/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */
import {type SelectOption, type SelectOptionValue} from '@myparcel-do/shared';
import {EcoFriendlyLabel, PriceTag} from '../../common';
import {type GroupInputSlots} from '../../../types';
import {useLanguage} from '../../../composables';

defineSlots<GroupInputSlots<T>>();

defineProps<{options: SelectOption<T>[]; id: string}>();

const {translate} = useLanguage();
</script>
