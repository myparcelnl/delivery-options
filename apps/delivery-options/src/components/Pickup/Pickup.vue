<template>
  <td>
    <div class="pb-2">
      <CButton
        v-test="'button--list'"
        :is-selected="selected === views.list"
        @click="selected = views.list"
        v-text="$configBus.strings.pickupLocationsListButton" />
      <CButton
        v-test="'button--map'"
        class="ml-1"
        :is-selected="selected === views.map"
        @click="selected = views.map"
        v-text="$configBus.strings.pickupLocationsMapButton" />
    </div>

    <transition name="shove">
      <div :class="`${$classBase}__pickup-locations--list`">
        <recursive-form
          v-if="selected === views.list"
          v-test="'view--list'"
          :option="listOption" />
      </div>
    </transition>
    <transition name="shove">
      <keep-alive>
        <Leaflet
          v-if="selected === views.map"
          v-test="'view--map'"
          :data="data" />
      </keep-alive>
    </transition>
  </td>
</template>

<script>
import {CONFIG} from '../../data';
import * as FORM from '../../config/formConfig';
import CButton from '../../components/CButton.vue';
import Leaflet from '../../components/Pickup/Map/Leaflet.vue';
import PickupOption from '../../components/Pickup/PickupOption.vue';

const MAP_VIEW = 'map';
const LIST_VIEW = 'list';

export default {
  name: 'Pickup',
  components: { CButton, Leaflet },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      selected: null,
      listOption: {
        name: FORM.PICKUP_LOCATION,
        type: 'radio',
        component: PickupOption,
        pagination: this.$configBus.get(CONFIG.FEATURE_MAX_PAGE_ITEMS),
        choices: this.data.choices,
      },

      views: {
        map: MAP_VIEW,
        list: LIST_VIEW,
      },
    };
  },

  created() {
    this.selected = this.getDefaultMapView();
  },

  methods: {
    /**
     * Get the default map view setting or fall back to default.
     *
     * @returns {string}
     */
    getDefaultMapView() {
      const setting = this.$configBus.get(CONFIG.FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW);

      if (setting && this.views.hasOwnProperty(setting)) {
        return setting;
      }

      return this.views.map;
    },
  },
};
</script>
