<template>
  <Story :layout="{type: 'grid', width: '50%'}">
    <Variant title="Default">
      <InfoLabel :label="state.label" />
    </Variant>

    <Variant title="Default with icon">
      <InfoLabel :label="state.label">
        <template #icon>
          <ParcelLockerIcon />
        </template>
      </InfoLabel>
    </Variant>

    <Variant title="Green">
      <InfoLabel
        :label="state.label"
        variant="green" />
    </Variant>

    <Variant title="Green with icon">
      <InfoLabel
        :label="state.label"
        variant="green">
        <template #icon>
          <ParcelLockerIcon />
        </template>
      </InfoLabel>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import {reactive} from 'vue';
import ParcelLockerIcon from '../../icons/ParcelLockerIcon.vue';
import InfoLabel from './InfoLabel.vue';

const state = reactive({
  label: 'Hello world',
});
</script>
