<template>
  <Story
    :layout="{
      type: 'grid',
      width: '20%',
    }">
    <Variant title="Eco friendly">
      <EcoFriendlyIcon />
    </Variant>

    <Variant title="Parcel locker">
      <ParcelLockerIcon />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import ParcelLockerIcon from './ParcelLockerIcon.vue';
import EcoFriendlyIcon from './EcoFriendlyIcon.vue';
</script>
