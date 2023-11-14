<template>
  <form class="form">
    <div class="alert alert-secondary my-3">
      <Heading :level="4">
        {{ $t(`platform.${platform}`) }}
      </Heading>

      <BBtn
        v-for="(link, index) in getPlatformData(platform).links"
        :key="`button_${link.text}`"
        :class="{
          'ml-1': index > 0,
        }"
        :href="link.href"
        size="sm">
        <span v-t="link.text" />
        <Fa
          :icon="faExternalLinkAlt"
          class="ml-1" />
      </BBtn>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <Heading>Address</Heading>
        <FormGroup
          :form-item="$config.get(`forms.address.${platform}`)"
          :level="2"
          :prefix="`${platform}.`" />
      </div>
    </div>

    <FormGroup
      v-for="setting in resolvedForm"
      :key="`${platform}.${setting.title}`"
      :form-item="setting"
      :prefix="`${platform}.`" />
  </form>
</template>

<script lang="ts">
import {DEFAULT_PLATFORM} from '@myparcel-do/shared';
import Heading from './Heading.vue';
import FormGroup from './FormGroup.vue';

export default {
  name: 'SettingsForm',
  components: {Heading, FormGroup, Fa},

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
    this.resolvedForm = typeof this.form === 'function' ? this.form() : this.form;
  },

  methods: {
    getPlatformData(platform) {
      return platformTabs.find(({name}) => name === platform);
    },
  },
};
</script>
