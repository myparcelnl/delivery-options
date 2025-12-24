<template>
  <div class="mp-grid mp-gap-4 mp-mb-4">
    <SandboxPlatformBox />

    <SandboxAddressBox />

    <SandboxPackageTypeBox />

    <SandboxCarrierConfigBox />

    <SandboxFeaturesBox />
  </div>
</template>

<script lang="ts" setup>
import {useLanguage} from '../composables';
import SandboxPlatformBox from './SandboxPlatformBox.vue';
import SandboxPackageTypeBox from './SandboxPackageTypeBox.vue';
import SandboxFeaturesBox from './SandboxFeaturesBox.vue';
import SandboxCarrierConfigBox from './SandboxCarrierConfigBox.vue';
import SandboxAddressBox from './SandboxAddressBox.vue';

await useLanguage().load();
</script>
