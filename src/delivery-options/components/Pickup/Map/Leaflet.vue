<template>
  <div
    :class="{
      [baseClass]: true,
      [`${baseClass}--modal`]: showModal,
    }">
    <Modal
      v-if="showModal"
      inline
      :component="modalComponent"
      :modal-data="selectedPickupLocation"
      :has-close-button="true"
      @close="showModal = false" />

    <div v-show="!showModal">
      <LMap
        v-if="showMap"
        ref="map"
        :class="mapClass"
        :center="center">
        <LMarker
          v-for="marker in markers"
          :key="'marker_' + marker.id"
          :ref="marker.id"
          :lat-lng="marker.latLng"
          :icon="marker.icon"
          @click="onClickMarker(marker)" />
      </LMap>
    </div>
  </div>
</template>

<script>
import * as CONFIG from '@/data/keys/configKeys';
import * as EVENTS from '@/config/eventConfig';
import * as FORM from '@/config/formConfig';
import {CarrierConfigurationFactory} from '@/data/carriers/carrierConfigurationFactory';
import Modal from '@/delivery-options/components/Modal';
import {NETHERLANDS} from '@myparcel/js-sdk/dist/constant/countries-iso2';
import PickupDetails from '@/delivery-options/components/Pickup/PickupDetails';
import Vue from 'vue';
import {createIcons} from '@/delivery-options/components/Pickup/Map/createIcons';
import {createPickupChoices} from '@/delivery-options/data/pickup/createPickupChoices';
import {createScript} from '@/delivery-options/services/createScript';
import debounce from 'lodash-es/debounce';
import {fetchPickupLocations} from '@/delivery-options/data/pickup/fetchPickupLocations';

/**
 * @member this.$refs.map
 * @property {L} mapObject
 */

const MINIMUM_VISIBLE_MARKERS = 5;

/* eslint-disable babel/new-cap */
export default {
  name: 'Leaflet',
  components: {
    Modal,
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data() {
    const DEBOUNCE_DELAY = 300;
    const DEFAULT_LAT = 52.2906535;
    const DEFAULT_LONG = 4.7070306;

    return {
      showModal: false,
      modalComponent: PickupDetails,
      modalData: null,

      center: [DEFAULT_LAT, DEFAULT_LONG],

      /**
       * The Leaflet map will be stored in this variable.
       *
       * @type {Map}
       */
      map: null,

      /**
       * All pickup location markers.
       */
      markers: [],

      /**
       * The marker icons.
       */
      icons: [],

      /**
       * The marker that is displayed in the center of the map.
       */
      centerMarker: null,

      choices: null,

      showMap: false,

      selectedMarker: null,

      /**
       * Whether the onmove event can trigger searching for new pickup locations.
       */
      allowDrag: false,

      /**
       * Base class to use with the map and its child elements.
       */
      baseClass: `${this.$classBase}__pickup-locations--map`,

      /**
       * Listeners object for easy adding/removing.
       */
      listeners: {
        moveEnd: debounce(this.onMoveEnd, DEBOUNCE_DELAY),
        zoomEnd: debounce(this.onZoomEnd, DEBOUNCE_DELAY),
      },

      selectedPickupLocation: null,
    };
  },

  computed: {
    /**
     * TODO: Disallows dragging for non-NL countries.
     *  When we can look up pickup points using coordinates everywhere this can be removed.
     *  Research: https://jira.dmp.zone/browse/MY-16566.
     *
     *  @returns {Boolean}
     */
    canUseDragFeature() {
      return NETHERLANDS === this.$configBus.address.cc;
    },

    mapClass() {
      return `${this.baseClass}__leaflet`;
    },
  },

  /**
   * On mounting the map component, load all the needed scripts externally. This is done to not bloat the bundle size
   *  and only load the map when the user selects it.
   */
  async mounted() {
    // Skip all script loading if RequireJS is detected. It does NOT like us loading scripts manually.
    const loadScripts = typeof requirejs === 'undefined';

    if (loadScripts) {
      const scripts = [];
      const leafletCss = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.6.0/leaflet.css';
      const leafletJs = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.6.0/leaflet.js';
      const vue2LeafletJs = 'https://cdnjs.cloudflare.com/ajax/libs/Vue2Leaflet/1.0.2/vue2-leaflet.min.js';

      if (!document.querySelector(`link[href="${leafletCss}"]`)) {
        scripts.push(leafletCss);
      }

      if (typeof L === 'undefined') {
        scripts.push(leafletJs);
      }

      await Promise.all(scripts.map((script) => createScript(script)));

      /**
       * This scripts depends on leaflet.js so has to wait until it's loaded.
       */
      if (typeof Vue2Leaflet === 'undefined') {
        await createScript(vue2LeafletJs);
      }
    }

    this.onLoadedScripts();
  },

  created() {
    this.choices = this.data.choices;
  },

  /**
   * This element is used in a <keep-alive> component. This hook will be triggered on "reactivating" the element.
   *
   * @see https://vuejs.org/v2/api/#keep-alive
   */
  activated() {
    this.showModal = false;

    // Don't do this if the map hasn't been created yet because createMap also calls this function.
    if (this.map) {
      this.selectSelectedPickupLocation();
    }
  },

  methods: {
    selectSelectedPickupLocation() {
      const selectedPickupLocation = this.$configBus.getValue(FORM.PICKUP_LOCATION);
      const selectedMarker = this.getMarkerByLocationCode(selectedPickupLocation);

      if (selectedPickupLocation && selectedMarker) {
        this.manuallySelectMarker(selectedMarker);
      }
    },

    /**
     * When all Leaflet scripts are loaded, initialize the Vue2Leaflet components and start creating the map.
     *
     * @member {Object} Vue2Leaflet
     * @property {Vue.Component} Vue2Leaflet.LMap
     * @property {Vue.Component} Vue2Leaflet.LMarker
     * @property {Vue.Component} Vue2Leaflet.LPopup
     * @property {Vue.Component} Vue2Leaflet.LTileLayer
     */
    onLoadedScripts() {
      Vue.component('LMap', Vue2Leaflet.LMap);
      Vue.component('LMarker', Vue2Leaflet.LMarker);
      Vue.component('LPopup', Vue2Leaflet.LPopup);
      Vue.component('LTileLayer', Vue2Leaflet.LTileLayer);
      this.createMap();
    },

    createMap() {
      this.showMap = true;

      this.$nextTick(() => {
        if (!this.$refs.map) {
          return;
        }

        this.map = this.$refs.map.mapObject;
        this.icons = createIcons(`${this.mapClass}__marker`);

        this.setTileLayer();
        this.createMarkers();
        this.fitToMarkers();
        this.createCenterMarker();

        this.selectSelectedPickupLocation();

        if (!this.selectedMarker) {
          this.selectFirstMarker();
        }

        this.addMapEvents();
      });
    },

    getMarkerByLocationCode(code) {
      return this.markers.find((marker) => marker.id === code);
    },

    /**
     * Add the tile layer to the map.
     */
    setTileLayer() {
      let data = this.$configBus.get(CONFIG.PICKUP_LOCATIONS_MAP_TILE_LAYER_DATA);

      if (typeof data === 'string') {
        data = JSON.parse(data);
      }

      const { url, ...tileLayerData } = data;
      const tileLayer = L.tileLayer(url, tileLayerData);

      tileLayer.addTo(this.map);
    },

    /**
     * @param {Object} marker - Marker to formSelect.
     */
    selectMarker(marker) {
      if (this.selectedMarker) {
        // Replace the active icon with the regular icon if there already was a selected marker.
        this.selectedMarker.icon = this.getCarrierIcon(this.selectedMarker.data.carrier);
      }

      this.selectedMarker = marker;
      this.selectedPickupLocation = {
        ...this.selectedMarker.data,
        ...this.getChoiceByMarkerId(this.selectedMarker.id),
      };

      // Replace the icon with the active version.
      this.selectedMarker.icon = this.getCarrierIcon(this.selectedMarker.data.carrier, true);
    },

    /**
     * @param {Object} marker - Marker that was clicked.
     */
    onClickMarker(marker) {
      this.selectMarker(marker);
      this.$configBus.$emit(EVENTS.UPDATE, { name: FORM.PICKUP_LOCATION, value: this.selectedPickupLocation.name });
      this.$configBus.$emit(EVENTS.UPDATE, { name: FORM.CARRIER, value: this.selectedPickupLocation.carrier });

      this.showModal = true;
    },

    /**
     * Execute selectMarker but also emit some events manually. This is used for selecting without clicking a marker as
     *  the recursiveForm inside the modal would emit these events.
     *
     * @param {Object} marker - Marker to formSelect.
     */
    manuallySelectMarker(marker) {
      this.selectMarker(marker);

      const firstPickupMoment = this.selectedPickupLocation.pickupData.possibilities[0].delivery_type_name;

      // Set the pickup moment to the first available possibility manually.
      this.$configBus.$emit(EVENTS.UPDATE, { name: FORM.PICKUP_MOMENT, value: firstPickupMoment });
    },

    createMarkers() {
      this.markers = this.choices.reduce((acc, currentChoice) => {
        const { carrier, pickupData } = currentChoice;
        const latLng = L.latLng(pickupData.location.latitude, pickupData.location.longitude);

        const id = pickupData.location.location_code;
        const hasSelectedMarker = !!this.selectedMarker;
        const isActiveIcon = hasSelectedMarker && id === this.selectedMarker.id;

        return [
          ...acc,
          {
            latLng,
            id,
            icon: this.getCarrierIcon(carrier, isActiveIcon),
            data: pickupData,
          },
        ];
      }, []);
    },

    /**
     * Fit the bounds of the map to the closest few markers so at least something is visible no matter the distance.
     */
    fitToMarkers() {
      const firstFewMarkers = this.markers.slice(0, MINIMUM_VISIBLE_MARKERS);
      const bounds = firstFewMarkers.map((marker) => marker.latLng);

      this.map.fitBounds(bounds);
    },

    addMapEvents() {
      if (this.canUseDragFeature) {
        this.map.on('moveend', this.listeners.moveEnd);
        this.map.on('zoomend', this.listeners.zoomEnd);
      }
    },

    /**
     * When the user stops dragging or zooming, update the center marker, fetch new pickup locations for the new center
     *  and replace the existing ones on the map.
     *
     * @see https://leafletjs.com/reference-1.6.0.html#map-moveend
     */
    async onMoveEnd() {
      if (!this.allowDrag) {
        return;
      }

      const center = this.map.getCenter();

      this.centerMarker._icon.classList.add(`${this.mapClass}__marker--center--loading`);
      this.centerMarker.setLatLng(center);

      // Map the new center latlng to the request parameters.
      const useLatLng = (carrier) => fetchPickupLocations(
        CarrierConfigurationFactory.create(carrier.name),
        {
          latitude: center.lat,
          longitude: center.lng,
        },
      );

      this.choices = await createPickupChoices(useLatLng);
      this.createMarkers();

      this.centerMarker._icon.classList.remove(`${this.mapClass}__marker--center--loading`);
    },

    /**
     * Place the center marker on the map.
     */
    createCenterMarker() {
      const zIndexOffset = 999;
      this.centerMarker = L.marker(this.map.getCenter(), { icon: this.icons.default, zIndexOffset });

      this.centerMarker.addTo(this.map);
    },

    /**
     * @param {Object} marker - Marker object.
     *
     * @returns {Boolean}
     */
    isSelected(marker) {
      return marker.location.location_code === this.$configBus.get(FORM.PICKUP_LOCATION);
    },

    /**
     * Try to postpone allowing to drag the map to when the initial zooming by fitBounds() is complete to avoid the map
     *  looking for new pickup locations immediately.
     *
     * @see https://leafletjs.com/reference-1.6.0.html#map-zoomend
     */
    onZoomEnd() {
      const ALLOW_DRAG_DELAY = 300;

      setTimeout(() => {
        this.allowDrag = true;
      }, ALLOW_DRAG_DELAY);

      this.map.off('zoomend', this.listeners.zoomEnd);
    },

    /**
     * Get the option relating to the given pickup location id.
     *
     * @param {String} id - Marker id, which is a pickup location id.
     *
     * @returns {Object}
     */
    getChoiceByMarkerId(id) {
      return this.choices.find((choice) => choice.name === id);
    },

    /**
     * Select the first marker in the choices list.
     */
    selectFirstMarker() {
      const firstChoice = this.markers[0];

      this.selectedMarker = this.manuallySelectMarker(firstChoice);
    },

    /**
     * Get the carrier icon for the given carrier in either the normal or active state.
     *
     * @param {Object} carrier - Carrier to get the icon of.
     * @param {Boolean} active - Whether it should be the active icon or not.
     *
     * @returns {Object}
     */
    getCarrierIcon(carrier, active = false) {
      const carrierName = carrier;
      const suffix = active ? '_active' : '';

      if (!this.icons.hasOwnProperty(carrierName + suffix)) {
        throw `Icon "${carrierName}${suffix}" doesn't exist`;
      }
      return this.icons[carrierName + suffix];
    },
  },
};
</script>
