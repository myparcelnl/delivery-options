<template>
  <div class="mp-grid mp-gap-4 mp-mb-4">
    <SandboxApiKeyBox />

    <SandboxPlatformBox />

    <SandboxAddressBox />

    <SandboxPackageTypeBox />

    <SandboxCarrierConfigBox />

    <SandboxFeaturesBox />
  </div>
</template>

<script lang="ts" setup>
import {useLanguage} from '../composables';
import SandboxApiKeyBox from './SandboxApiKeyBox.vue';
import SandboxPlatformBox from './SandboxPlatformBox.vue';
import SandboxPackageTypeBox from './SandboxPackageTypeBox.vue';
import SandboxFeaturesBox from './SandboxFeaturesBox.vue';
import SandboxCarrierConfigBox from './SandboxCarrierConfigBox.vue';
import SandboxAddressBox from './SandboxAddressBox.vue';

await useLanguage().load();
</script>
