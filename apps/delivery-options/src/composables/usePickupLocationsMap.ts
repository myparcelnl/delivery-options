import {type Ref, ref, computed, watch, toRef, toValue, type ComputedRef} from 'vue';
import {isString} from 'radash';
import {type Map, type TileLayer, type Control} from 'leaflet';
import {isDef, useDebounceFn, useMemoize} from '@vueuse/core';
import {type MapTileLayerData, ConfigSetting} from '@myparcel-do/shared';
import {type LeafletMapProps, type MapMarker} from '../types';
import {useConfigStore} from '../stores';
import {MAP_MARKER_CLASS_ACTIVE} from '../data';
import {useResolvedPickupLocations} from './useResolvedPickupLocations';

type StopCallback = () => void;

interface UsePickupLocationsMap {
  activeMarker: ComputedRef<undefined | MapMarker>;
  loaded: ComputedRef<boolean>;
  map: Ref<undefined | Map>;
  markers: Ref<MapMarker[]>;
  scaleControl: Ref<undefined | Control.Scale>;
  showLoadMoreButton: Ref<boolean>;
  tileLayer: Ref<undefined | TileLayer>;

  fitBounds(): void;

  initializeMap(container: Ref<HTMLElement | undefined>, settings?: LeafletMapProps): undefined | StopCallback;
}

const LEAFLET_DEFAULT_ZOOM = 14;

// eslint-disable-next-line max-lines-per-function
export const usePickupLocationsMap = useMemoize((): UsePickupLocationsMap => {
  const {carriersWithPickup} = useResolvedPickupLocations();
  const config = useConfigStore();

  /**
   * The element that the map is rendered in.
   */
  const container = ref<HTMLElement | undefined>();

  /**
   * The Leaflet map instance.
   */
  const map = ref<Map>();

  /**
   * The Leaflet tile layer instance.
   */
  const tileLayer = ref<TileLayer>();

  /**
   * The markers that are displayed on the map.
   */
  const markers = ref<MapMarker[]>([]);

  /**
   * The Leaflet scale control instance.
   */
  const scaleControl = ref<Control.Scale>();

  /**
   * The center of the map.
   */
  const center = ref<NonNullable<LeafletMapProps['center']>>([0, 0]);

  /**
   * The zoom level of the map.
   */
  const zoom = ref<NonNullable<LeafletMapProps['zoom']>>(LEAFLET_DEFAULT_ZOOM);

  const mutableShowLoadMoreButton = ref<boolean>(false);

  const showLoadMoreButton = computed({
    get() {
      const anyCarrierCanLoadMore = toValue(carriersWithPickup).some((carrier) => {
        return toValue(carrier.features).has(ConfigSetting.PickupMapAllowLoadMore);
      });

      return anyCarrierCanLoadMore && mutableShowLoadMoreButton.value;
    },
    set(value) {
      mutableShowLoadMoreButton.value = value;
    },
  });

  const tileLayerData = computed<MapTileLayerData>(() => {
    if (isString(config.pickupLocationsMapTileLayerData)) {
      return JSON.parse(config.pickupLocationsMapTileLayerData);
    }

    return config.pickupLocationsMapTileLayerData;
  });

  const initializeMap = (element: Ref<HTMLElement | undefined>): undefined | StopCallback => {
    container.value = element.value;

    if (!isDef(container.value)) {
      return;
    }

    const {attribution, maxZoom, url, token} = tileLayerData.value;

    map.value = new L.Map(container.value, {
      preferCanvas: true,
      zoom: toValue(zoom),
      center: toValue(center),
      maxZoom,
    });

    if (!isDef(map.value)) {
      return;
    }

    tileLayer.value = new L.TileLayer(url, {attribution, maxZoom, accessToken: token}).addTo(map.value);
    scaleControl.value = new L.Control.Scale().addTo(map.value);

    map.value.on('layeradd', fitBounds);
    map.value.on('layerremove', fitBounds);

    map.value.on('dragend', () => {
      showLoadMoreButton.value = true;
    });

    const unwatchZoom = watch(toRef(zoom), () => {
      return map.value?.setZoom(toValue(zoom));
    });

    return () => {
      map.value?.remove();
      unwatchZoom();
    };
  };

  const fitBounds = useDebounceFn(() => {
    if (!container.value || !map.value || !markers.value.length) {
      return;
    }

    // eslint-disable-next-line new-cap
    const group = new L.featureGroup(markers.value);
    const zoomLevel = map.value?.getZoom() ?? toValue(zoom);
    const bounds = group.getBounds();

    if (bounds.isValid()) {
      map.value?.fitBounds(bounds, {maxZoom: zoomLevel});
    }
  }, 100);

  const loaded = computed(() => {
    return (
      Boolean(toValue(container)) &&
      Boolean(toValue(map)) &&
      Boolean(toValue(tileLayer)) &&
      Boolean(toValue(scaleControl))
    );
  });

  const activeMarker = computed<MapMarker | undefined>(() => {
    return toValue(markers).find((marker) => {
      const element = marker.getElement();

      return element?.classList.contains(MAP_MARKER_CLASS_ACTIVE);
    }) as MapMarker | undefined;
  });

  return {
    fitBounds,
    initializeMap,

    activeMarker,
    loaded,
    map,
    // @ts-expect-error todo: fix leaflet type errors
    markers,
    scaleControl,
    showLoadMoreButton,
    tileLayer,
  };
});
