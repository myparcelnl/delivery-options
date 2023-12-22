<template>
  <InfoLabel
    :label="mostEcoFriendly ? translate('most_eco_friendly') : undefined"
    variant="green">
    <EcoFriendlyIcon />
  </InfoLabel>
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import InfoLabel from '../InfoLabel/InfoLabel.vue';
import EcoFriendlyIcon from '../../icons/EcoFriendlyIcon.vue';
import {useLanguage, useMostEcoFriendly} from '../../../composables';

const props = defineProps<{amount: number; id: string}>();

const propRefs = toRefs(props);

const {translate} = useLanguage();

const mostEcoFriendly = useMostEcoFriendly(propRefs.amount, propRefs.id);
</script>
