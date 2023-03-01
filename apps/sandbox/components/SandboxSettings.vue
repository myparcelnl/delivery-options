<template>
  <div class="container-fluid py-3">
    <div class="row">
      <div class="col-12 col-md-6">
        <Heading :level="2">
          {{ $t('settings.title') }}
        </Heading>

        <SandboxTabs
          :tabs="$config.get('tabs.settings')"
          @switched-tab="switchPlatform" />
      </div>

      <div class="col-12 col-md-6">
        <Heading :level="2">
          {{ $t('result.title') }}
        </Heading>
        <SandboxTabs
          v-if="formRendered"
          class="sticky-top"
          :tabs="$config.get('tabs.previews')" />
      </div>
    </div>
  </div>
</template>

<script>
import Heading from '@/sandbox/components/Heading';
import SandboxTabs from '@/sandbox/components/SandboxTabs';
import debounce from 'lodash-es/debounce';
import { sandboxConfigBus } from '@/sandbox/sandboxConfigBus';

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
    sandboxConfigBus.$on('created:formItem', debounce(() => {
      this.formRendered = true;
    }), DEBOUNCE_DELAY);
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
