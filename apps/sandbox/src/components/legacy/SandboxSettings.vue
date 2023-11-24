<template>
  <div class="container-fluid py-3">
    <div class="row">
      <div class="col-12 col-md-6">
        <Heading :level="2">
          {{ $t('settings.title') }}
        </Heading>

        <SandboxTabs
          :tabs="$config.get('tabs.settings')"
          @switchedTab="switchPlatform" />
      </div>

      <div class="col-12 col-md-6">
        <Heading :level="2">
          {{ $t('result.title') }}
        </Heading>
        <SandboxTabs
          v-if="formRendered"
          :tabs="$config.get('tabs.previews')"
          class="sticky-top" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {sandboxConfigBus} from '../sandboxConfigBus';
import SandboxTabs from './SandboxTabs.vue';
import Heading from './Heading.vue';

export default {
  name: 'SandboxSettings',
  components: {
    Heading,
    SandboxTabs,
  },

  data() {
    return {
      formRendered: false,
    };
  },

  created() {
    const DEBOUNCE_DELAY = 50;

    // Catch formItem created events and use debouncing to only set formRendered when the last one is done.
    sandboxConfigBus.$on(
      'created:formItem',
      debounce(() => {
        this.formRendered = true;
      }),
      DEBOUNCE_DELAY,
    );
  },

  beforeUnmount() {
    sandboxConfigBus.$off('created:formItem');
  },

  methods: {
    /**
     * @param {MyParcel.Platform} platform
     */
    switchPlatform(platform) {
      sandboxConfigBus.setPlatform(platform);
    },
  },
};
</script>
