<template>
  <transition-group name="fade">
    <PreLoader
      v-if="loading"
      key="preloader" />
    <template v-else>
      <SandboxHeader key="header" />
      <SandboxIntroduction key="intro" />
      <SandboxSettings key="settings" />
      <SandboxFooter key="footer" />
    </template>
  </transition-group>
</template>

<script>
import { sandboxConfigBus } from './sandboxConfigBus';

export default {
  name: 'Sandbox',

  components: {
    PreLoader: () => import('./components/PreLoader'),
    SandboxHeader: () => import('./components/SandboxHeader'),
    SandboxIntroduction: () => import('./components/SandboxIntroduction'),
    SandboxSettings: () => import('./components/SandboxSettings'),
    SandboxFooter: () => import('./components/SandboxFooter'),
  },

  data() {
    return {
      loading: true,
    };
  },

  async created() {
    await sandboxConfigBus.fetchCarrierData();
    this.loading = false;
  },
};
</script>
