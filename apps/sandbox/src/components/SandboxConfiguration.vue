<template>
  <div class="mp-gap-4 mp-grid mp-mb-4">
    <SandboxApiKeyBox />

    <SandboxAddressBox />

    <SandboxPackageTypeBox />

    <SandboxCarrierConfigBox />

    <SandboxFeaturesBox />
  </div>
</template>

<script lang="ts" setup>
import {useLanguage} from '../composables';
import SandboxPackageTypeBox from './SandboxPackageTypeBox.vue';
import SandboxFeaturesBox from './SandboxFeaturesBox.vue';
import SandboxCarrierConfigBox from './SandboxCarrierConfigBox.vue';
import SandboxApiKeyBox from './SandboxApiKeyBox.vue';
import SandboxAddressBox from './SandboxAddressBox.vue';

await useLanguage().load();
</script>
