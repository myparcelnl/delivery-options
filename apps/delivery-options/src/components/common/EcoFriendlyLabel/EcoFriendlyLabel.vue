<template>
  <span
    :class="{
      'mp-px-1': !mostEcoFriendly,
      'mp-px-2': mostEcoFriendly,
    }"
    class="mp-bg-green-700 mp-bg-opacity-30 mp-border mp-border-green-700 mp-rounded-full mp-text-green-900">
    <span>
      🍀
      <template v-if="mostEcoFriendly">&nbsp;{{ translate('most_eco_friendly') }}</template>
    </span>
  </span>
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {useLanguage, useMostEcoFriendly} from '../../../composables';

const props = defineProps<{amount: number; id: string}>();

const propRefs = toRefs(props);

const {translate} = useLanguage();

const mostEcoFriendly = useMostEcoFriendly(propRefs.amount, propRefs.id);
</script>
