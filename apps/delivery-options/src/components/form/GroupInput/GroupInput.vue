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
          <span v-text="option.label" />
        </slot>

        <EcoFriendlyLabel
          v-if="option.ecoFriendly"
          :id="id"
          :amount="option.ecoFriendly" />
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
import {EcoFriendlyLabel} from '../../common';
import {type GroupInputSlots} from '../../../types';

defineSlots<GroupInputSlots<T>>();

defineProps<{options: SelectOption<T>[]; id: string}>();
</script>
