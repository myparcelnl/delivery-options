import {ref} from 'vue';
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import * as Leaflet from 'leaflet';
import {mockDeliveryOptionsConfig} from '../__tests__';
import {usePickupLocationsMap} from './usePickupLocationsMap';

const DEFAULT_ZOOM = 14;

describe('usePickupLocationsMap', () => {
  let teardown: undefined | (() => void);

  const initialize = () => {
    const container = ref<HTMLElement>(document.createElement('div'));

    document.body.appendChild(container.value);

    const composable = usePickupLocationsMap();

    teardown = composable.initializeMap(container);

    return composable;
  };

  beforeEach(() => {
    vi.stubGlobal('L', Leaflet);
    setActivePinia(createPinia());
    mockDeliveryOptionsConfig();
    vi.useFakeTimers();
  });

  afterEach(() => {
    teardown?.();
    teardown = undefined;
    usePickupLocationsMap().markers.value = [];
    vi.useRealTimers();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('does not create a map without a container element', () => {
    const {initializeMap, loaded} = usePickupLocationsMap();

    expect(initializeMap(ref())).toBeUndefined();
    expect(loaded.value).toBe(false);
  });

  it('fits the map to the markers, zoomed in to the default zoom level at most', async () => {
    const {map, markers, fitBounds} = initialize();
    const fitBoundsSpy = vi.spyOn(map.value as Leaflet.Map, 'fitBounds');

    // A consumer zoomed in further than the default must not raise the zoom limit.
    map.value?.setZoom(18);
    markers.value = [Leaflet.marker([52.0, 4.0]), Leaflet.marker([52.1, 4.1])];

    fitBounds();
    await vi.advanceTimersByTimeAsync(100);

    expect(fitBoundsSpy).toHaveBeenCalledOnce();
    expect(fitBoundsSpy).toHaveBeenCalledWith(expect.any(Leaflet.LatLngBounds), {maxZoom: DEFAULT_ZOOM});
  });

  it('does not fit the map when there are no markers', async () => {
    const {map, fitBounds} = initialize();
    const fitBoundsSpy = vi.spyOn(map.value as Leaflet.Map, 'fitBounds');

    fitBounds();
    await vi.advanceTimersByTimeAsync(100);

    expect(fitBoundsSpy).not.toHaveBeenCalled();
  });

  it('does not fit the map when the markers have no valid bounds', async () => {
    const {map, markers, fitBounds} = initialize();
    const fitBoundsSpy = vi.spyOn(map.value as Leaflet.Map, 'fitBounds');

    // An empty layer group has no coordinates, so its bounds are invalid.
    markers.value = [Leaflet.featureGroup() as unknown as Leaflet.Marker];

    fitBounds();
    await vi.advanceTimersByTimeAsync(100);

    expect(fitBoundsSpy).not.toHaveBeenCalled();
  });
});
