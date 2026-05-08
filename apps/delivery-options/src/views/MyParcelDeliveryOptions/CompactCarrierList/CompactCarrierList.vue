<template>
  <ul class="mp-flex mp-flex-col mp-gap-2 mp-list-none mp-p-0 mp-m-0">
    <li
      v-for="item in items"
      :key="item.value">
      <button
        type="button"
        class="mp-flex mp-items-center mp-gap-3 mp-w-full mp-p-3 mp-text-left mp-rounded-md mp-border mp-border-gray-200 mp-bg-white hover:mp-bg-gray-50 hover:mp-border-gray-300 focus:mp-outline-none focus:mp-ring-2 focus:mp-ring-offset-1 focus:mp-ring-blue-500 mp-transition mp-cursor-pointer"
        :data-testid="`compact-item-${item.value}`"
        @click="onSelect(item.value)">
        <CarrierLogo
          :carrier="item.carrierIdentifier"
          small />

        <div class="mp-flex mp-flex-col mp-grow mp-min-w-0">
          <strong
            class="mp-truncate"
            v-text="item.carrierHuman" />
          <span
            class="mp-text-sm mp-text-gray-600 mp-truncate"
            v-text="translate(item.typeLabel)" />
        </div>

        <CaretRightIcon class="mp-text-gray-400 mp-flex-shrink-0" />
      </button>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import {computed, toValue} from 'vue';
import {
  type CarrierIdentifier,
  CarrierLogo,
  COMPACT_DELIVERY,
  COMPACT_PICKUP,
  useCarriersRequest,
} from '@myparcel-dev/do-shared';
import {HOME_OR_PICKUP_HOME, HOME_OR_PICKUP_PICKUP} from '../../../data';
import {useActiveCarriers, useLanguage, useSelectedValues} from '../../../composables';
import {CaretRightIcon} from '../../../components';

interface CompactItem {
  value: string;
  carrierIdentifier: CarrierIdentifier;
  carrierHuman: string;
  typeLabel: typeof COMPACT_DELIVERY | typeof COMPACT_PICKUP;
}

void useCarriersRequest().load();

const carriers = useActiveCarriers();
const {translate} = useLanguage();
const {homeOrPickup, carrier} = useSelectedValues();

const items = computed<CompactItem[]>(() => {
  const list: CompactItem[] = [];

  for (const c of toValue(carriers) ?? []) {
    const id = c.carrier.value?.identifier as CarrierIdentifier | undefined;
    const human = c.carrier.value?.human ?? c.carrier.value?.name ?? id;

    if (!id) continue;

    if (toValue(c.hasAnyDelivery)) {
      list.push({
        value: `${id}__home`,
        carrierIdentifier: id,
        carrierHuman: String(human),
        typeLabel: COMPACT_DELIVERY,
      });
    }

    if (toValue(c.hasPickup)) {
      list.push({
        value: `${id}__pickup`,
        carrierIdentifier: id,
        carrierHuman: String(human),
        typeLabel: COMPACT_PICKUP,
      });
    }
  }

  return list;
});

function onSelect(value: string): void {
  const [carrierId, type] = value.split('__');
  carrier.value = carrierId as CarrierIdentifier;
  homeOrPickup.value = type === 'pickup' ? HOME_OR_PICKUP_PICKUP : HOME_OR_PICKUP_HOME;
}
</script>
