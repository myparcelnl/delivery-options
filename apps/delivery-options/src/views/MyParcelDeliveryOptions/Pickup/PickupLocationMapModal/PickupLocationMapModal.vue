<template>
  <Modal
    :model-value="modelValue"
    @update:modelValue="onUpdate">
    <template #header>
      <strong v-text="translate(POP_UP_MAP_TITLE)" />
    </template>

    <div
      :id="POP_UP_MAP_TARGET_ID"
      class="mp-h-full mp-p-2" />

    <template #footer>
      <DoButton @click="confirm">
        {{ translate(POP_UP_MAP_CONFIRM) }}
      </DoButton>
    </template>
  </Modal>
</template>

<script lang="ts">
export const POP_UP_MAP_TARGET_ID = 'pop-up-map-target';

export const POP_UP_MAP_TARGET = `#${POP_UP_MAP_TARGET_ID}`;
</script>

<script lang="ts" setup>
import {POP_UP_MAP_CONFIRM, POP_UP_MAP_TITLE} from '@myparcel-dev/do-shared';
import {useLanguage} from '../../../../composables';
import {DoButton, Modal} from '../../../../components';

defineProps<{modelValue: boolean}>();
const emit = defineEmits<(e: 'update:modelValue', value: boolean) => void>();

const {translate} = useLanguage();

function onUpdate(value: boolean): void {
  emit('update:modelValue', value);
}

function confirm(): void {
  emit('update:modelValue', false);
}
</script>
