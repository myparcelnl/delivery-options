<template>
  <BTabs
    v-if="tabs.length > 1"
    content-class="py-2"
    justified>
    <BTab
      v-for="(tab, index) in tabs"
      :key="`tab_${tab.name}`"
      :active="activeTab ? activeTab === tab.name : index === 0"
      :title="$te(tab.label) ? $t(tab.label) : tab.label"
      @click="() => handleClick(tab)">
      <component
        :is="tab.component"
        v-bind="tab.props" />
    </BTab>
  </BTabs>

  <component
    :is="tabs[0].component"
    v-else
    v-bind="tabs[0].props" />
</template>

<script lang="ts">
export default {
  name: 'SandboxTabs',

  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      activeTab: null,
    };
  },

  methods: {
    handleClick(tab) {
      this.activeTab = tab.name;
      this.$emit('switched-tab', tab.name);
    },
  },
};
</script>
