<template>
  <PickupLocationMapLoader v-show="!loadedOnce && loading" />

  <KeepAlive>
    <PickupLocationMap
      v-if="loadedOnce"
      v-show="loadedOnce || !loading" />
  </KeepAlive>
</template>

<script lang="ts" setup>
import {ref, onMounted, computed} from 'vue';
import {useResolvedPickupLocations} from '../../../../composables';
import PickupLocationMapLoader from './PickupLocationMapLoader.vue';
import PickupLocationMap from './PickupLocationMap.vue';

const {locations} = useResolvedPickupLocations();

const loading = computed(() => locations.loading.value);
const loadedOnce = ref(false);

onMounted(async () => {
  await locations.load();

  loadedOnce.value = true;
});
</script>
