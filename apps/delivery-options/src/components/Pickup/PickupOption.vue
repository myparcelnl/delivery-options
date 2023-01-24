<template>
  <td>
    <label
      :for="`${$classBase}__pickupLocation--${data.name}`"
      :class="`${$classBase}__d-block`"
      @click="isSelected ? showModal() : null">
      <span
        v-if="pickupData.carrier.image"
        :class="[
          `${$classBase}__d-block`,
          `${$classBase}__float--left`,
        ]">
        <img
          :class="[
            `${$classBase}__image`,
            `${$classBase}__image--sm`,
          ]"
          :src="pickupData.carrier.image"
          :alt="pickupData.carrier.name">&nbsp;
      </span>

      <span :class="`${$classBase}__d-block`">
        <span v-text="data.label" />
        <Fa
          v-if="isSelected"
          :icon="faEllipsisH"
          :class="`${$classBase}__float--right`" />
      </span>

      <span
        v-if="featurePickupShowDistance"
        :class="`${$classBase}__d-block`">
        <span v-text="formatDistance(pickupData.location.distance)" />
      </span>

      <span
        v-else
        :class="[
          `${$classBase}__d-block`,
          `${$classBase}__text--small`,
        ]">
        <span v-text="`${pickupData.address.street} ${pickupData.address.number}`" />
      </span>
    </label>

    <template v-if="isSelected">
      <recursive-form
        v-for="subOption in data.options"
        :key="`${data.name}_${subOption.name}`"
        :option="subOption"
        :name="data.name" />
    </template>
  </td>
</template>

<script>
import {CONFIG} from '../../data';
import Fa from 'vue-fa';
import PickupDetails from './PickupDetails.vue';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH';

export default {
  name: 'PickupOption',
  components: { Fa },

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
        const intl = new Intl.NumberFormat(this.$configBus.get(CONFIG.LOCALE), { maximumFractionDigits: 1 });
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
