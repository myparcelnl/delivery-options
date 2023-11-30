<template>
  <div class="mp-relative">
    <aside class="mp-border mp-p-4 mp-rounded-lg mp-sticky mp-top-4">
      <ul>
        <li v-for="[anchor, label] in links.entries()">
          <a
            :href="`#${anchor}`"
            v-text="label" />
        </li>
      </ul>
    </aside>
  </div>
</template>

<script lang="ts" setup>
import {useAnchorLink} from './composables/useAnchorLink';

const {links} = useAnchorLink();
</script>
