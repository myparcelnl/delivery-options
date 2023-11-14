<template>
  <td>
    <label
      :class="`${$classBase}__d-block`"
      :for="`${$classBase}__pickupLocation--${data.name}`"
      @click="isSelected ? showModal() : null">
      <span
        v-if="carrierData.image"
        :class="[`${$classBase}__d-block`, `${$classBase}__float--left`]">
        <img
          :alt="carrierData.label"
          :class="[`${$classBase}__image`, `${$classBase}__image--sm`]"
          :src="carrierData.image"
          :title="carrierData.label" />
        &nbsp;
      </span>

      <span :class="`${$classBase}__d-block`">
        <span v-text="data.label" />
        <Fa
          v-if="isSelected"
          :class="`${$classBase}__float--right`"
          :icon="faEllipsisH" />
      </span>

      <span
        v-if="featurePickupShowDistance"
        :class="`${$classBase}__d-block`">
        <span v-text="formatDistance(pickupData.location.distance)" />
      </span>

      <span
        v-else
        :class="[`${$classBase}__d-block`, `${$classBase}__text--small`]">
        <span v-text="`${pickupData.address.street} ${pickupData.address.number}`" />
      </span>
    </label>

    <template v-if="isSelected">
      <recursive-form
        v-for="subOption in data.options"
        :key="`${data.name}_${subOption.name}`"
        :name="data.name"
        :option="subOption" />
    </template>
  </td>
</template>

<script lang="ts">
import {CONFIG} from '@myparcel-do/shared';
import PickupDetails from './PickupDetails.vue';

export default {
  name: 'PickupOption',
  components: {Fa},

  props: {
    isSelected: {
      type: Boolean,
    },

    data: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      faEllipsisH,
    };
  },

  computed: {
    featurePickupShowDistance() {
      return this.$configBus.isEnabled(CONFIG.FEATURE_PICKUP_SHOW_DISTANCE);
    },

    pickupData() {
      return this.data.pickupData;
    },

    carrierData() {
      return this.$configBus.carrierData.find((carrier) => carrier.name === this.data.pickupData.carrier) ?? {};
    },
  },

  methods: {
    /**
     * Format distance for given amount of meters.
     *
     * @param {number | string} distance - Distance in meters.
     *
     * @returns {string}
     */
    formatDistance(distance) {
      const mToKm = 1000;

      let unit = 'm';

      if (distance >= mToKm) {
        const intl = new Intl.NumberFormat(this.$configBus.get(CONFIG.LOCALE), {maximumFractionDigits: 1});
        distance = intl.format(distance / mToKm);
        unit = 'km';
      }

      return distance + unit;
    },

    showModal() {
      this.$configBus.showModal = true;
      this.$configBus.modalData = {
        ...this.pickupData,
        component: PickupDetails,
        hasCloseButton: true,
        options: this.data.options,
      };
    },
  },
};
</script>
