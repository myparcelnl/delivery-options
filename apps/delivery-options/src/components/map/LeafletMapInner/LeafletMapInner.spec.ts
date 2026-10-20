import type * as VueUse from '@vueuse/core';
import {Suspense, KeepAlive, defineComponent, h} from 'vue';
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import * as Leaflet from 'leaflet';
import {useScriptTag, useStyleTag} from '@vueuse/core';
import {flushPromises} from '@vue/test-utils';
import {render} from '@testing-library/vue';
import {usePickupLocationsMap} from '../../../composables';
import {mockDeliveryOptionsConfig} from '../../../__tests__';
import LeafletMapInner from './LeafletMapInner.vue';

vi.mock('@vueuse/core', async (importOriginal) => {
  const original = await importOriginal<typeof VueUse>();

  return {
    ...original,
    // Keep the Leaflet CDN script out of happy-dom.
    useScriptTag: vi.fn(() => ({load: vi.fn(), unload: vi.fn()})),
    useStyleTag: vi.fn(original.useStyleTag),
  };
});

const resizeObservers = new Set<MockResizeObserver>();

/** Lets a test trigger resizes, because happy-dom does no layout. */
class MockResizeObserver {
  public readonly callback: ResizeObserverCallback;

  public constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  public observe(): void {
    resizeObservers.add(this);
  }

  public unobserve(): void {
    resizeObservers.delete(this);
  }

  public disconnect(): void {
    resizeObservers.delete(this);
  }
}

const triggerResize = (): void => {
  resizeObservers.forEach((observer) => observer.callback([], observer as unknown as ResizeObserver));
};

const setContainerSize = (element: HTMLElement, width: number, height: number): void => {
  Object.defineProperty(element, 'clientWidth', {configurable: true, value: width});
  Object.defineProperty(element, 'clientHeight', {configurable: true, value: height});
};

const renderMap = async (options: {keepAlive?: boolean; beforeMount?: () => void} = {}) => {
  const inner = () => h(LeafletMapInner);
  const wrapper = defineComponent({
    render: () =>
      h(Suspense, null, {
        default: options.keepAlive ? () => h(KeepAlive, null, [inner()]) : inner,
      }),
  });

  options.beforeMount?.();

  const result = render(wrapper);

  await flushPromises();

  const map = usePickupLocationsMap().map.value as Leaflet.Map;

  return {...result, map, mapContainer: map.getContainer()};
};

describe('LeafletMapInner.vue', () => {
  beforeEach(() => {
    vi.stubGlobal('L', Leaflet);
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
    setActivePinia(createPinia());
    mockDeliveryOptionsConfig();

    usePickupLocationsMap().markers.value = [Leaflet.marker([52.0, 4.0]), Leaflet.marker([52.1, 4.1])];
  });

  afterEach(() => {
    resizeObservers.clear();
    usePickupLocationsMap().markers.value = [];
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('loads the Leaflet script when it is not loaded yet', async () => {
    const load = vi.fn(() => {
      vi.stubGlobal('L', Leaflet);

      return Promise.resolve();
    });

    vi.mocked(useScriptTag).mockReturnValueOnce({load, unload: vi.fn()} as unknown as ReturnType<typeof useScriptTag>);
    vi.stubGlobal('L', undefined);

    const {map} = await renderMap();

    expect(load).toHaveBeenCalledOnce();
    expect(map).toBeInstanceOf(Leaflet.Map);
  });

  it('logs an error when the Leaflet CSS fails to load', async () => {
    const error = new Error('CSS failed');

    vi.mocked(useStyleTag).mockReturnValueOnce({
      load: () => {
        throw error;
      },
      unload: vi.fn(),
    } as unknown as ReturnType<typeof useStyleTag>);

    await renderMap();

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledWith('Error loading Leaflet CSS:', error);
  });

  it('fits the map to the markers when its container gets a size', async () => {
    const {map, mapContainer} = await renderMap();
    const invalidateSizeSpy = vi.spyOn(map, 'invalidateSize');
    const fitBoundsSpy = vi.spyOn(map, 'fitBounds');

    vi.useFakeTimers();
    setContainerSize(mapContainer, 400, 300);
    triggerResize();
    await vi.advanceTimersByTimeAsync(100);

    expect(invalidateSizeSpy).toHaveBeenCalledOnce();
    expect(map.getSize()).toEqual(Leaflet.point(400, 300));
    expect(fitBoundsSpy).toHaveBeenCalledOnce();
  });

  it('keeps the pan and zoom of the consumer when a sized container resizes', async () => {
    const {map, mapContainer} = await renderMap({
      beforeMount: () => setContainerSize(HTMLElement.prototype, 400, 300),
    });

    // @ts-expect-error restore the happy-dom getters
    delete HTMLElement.prototype.clientWidth;
    // @ts-expect-error restore the happy-dom getters
    delete HTMLElement.prototype.clientHeight;

    expect(map.getSize()).toEqual(Leaflet.point(400, 300));

    const invalidateSizeSpy = vi.spyOn(map, 'invalidateSize');
    const fitBoundsSpy = vi.spyOn(map, 'fitBounds');

    vi.useFakeTimers();
    setContainerSize(mapContainer, 600, 300);
    triggerResize();
    await vi.advanceTimersByTimeAsync(100);

    expect(invalidateSizeSpy).toHaveBeenCalledOnce();
    expect(map.getSize()).toEqual(Leaflet.point(600, 300));
    expect(fitBoundsSpy).not.toHaveBeenCalled();
  });

  it('pans to the active marker or the center when it is activated', async () => {
    const panTo = vi.spyOn(Leaflet.Map.prototype, 'panTo');

    await renderMap({keepAlive: true});

    expect(panTo).toHaveBeenCalledWith(usePickupLocationsMap().center.value);
  });

  it('removes the map when it is unmounted', async () => {
    const {map, unmount} = await renderMap();
    const removeSpy = vi.spyOn(map, 'remove');

    unmount();

    expect(removeSpy).toHaveBeenCalledOnce();
    expect(usePickupLocationsMap().loaded.value).toBe(false);
  });
});
