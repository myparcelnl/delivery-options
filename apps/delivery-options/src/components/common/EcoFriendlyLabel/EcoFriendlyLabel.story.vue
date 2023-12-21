<template>
  <Story>
    <Variant title="Default">
      <EcoFriendlyLabel
        id="1"
        :amount="1" />
    </Variant>

    <Variant title="Most eco friendly">
      <EcoFriendlyLabel
        id="1"
        :amount="4" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import EcoFriendlyLabel from './EcoFriendlyLabel.vue';
</script>
