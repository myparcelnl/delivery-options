<template>
  <form class="form">
    <div class="alert alert-secondary my-3">
      <Heading :level="4">
        {{ $t(`platform.${platform}`) }}
      </Heading>

      <BBtn
        v-for="(link, index) in getPlatformData(platform).links"
        :key="'button_' + link.text"
        size="sm"
        :class="{
          'ml-1': index > 0,
        }"
        :href="link.href">
        <span v-t="link.text" />
        <Fa
          class="ml-1"
          :icon="faExternalLinkAlt" />
      </BBtn>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <Heading>Address</Heading>
        <FormGroup
          :level="2"
          :prefix="`${platform}.`"
          :form-item="$config.get(`forms.address.${platform}`)" />
      </div>
    </div>

    <FormGroup
      v-for="setting in resolvedForm"
      :key="`${platform}.${setting.title}`"
      :prefix="`${platform}.`"
      :form-item="setting" />
  </form>
</template>

<script lang="ts">
import { DEFAULT_PLATFORM } from '@/data/keys/settingsConsts';
import Fa from 'vue-fa';
import FormGroup from './FormGroup.vue';
import Heading from '@/sandbox/components/Heading';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { platformTabs } from '@/sandbox/config/tabs/platformTabs';

import {defineComponent} from 'vue'; export default defineComponent({
  name: 'SettingsForm',
  components: { Heading, FormGroup, Fa },

  props: {
    platform: {
      type: String,
      default: DEFAULT_PLATFORM,
    },
    form: {
      type: [Array, Function],
      default: null,
    },
  },

  data() {
    return {
      faExternalLinkAlt,
      resolvedForm: null,
    };
  },

  /**
   * Prepare the form variable based on it being a function or Array.
   */
  beforeMount() {
    this.resolvedForm = typeof this.form === 'function'
      ? this.form()
      : this.form;
  },

  methods: {
    getPlatformData(platform) {
      return platformTabs.find(({ name }) => name === platform);
    },
  },
});
</script>
