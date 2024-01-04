import {reactive, type Ref} from 'vue';
import L, {type Control, type Map, type TileLayer} from 'leaflet';
import {useScriptTag, useStyleTag} from '@vueuse/core';

const state = reactive<{
  loaded: boolean;
  map: Map | undefined;
  tileLayer: TileLayer | undefined;
  scale: Control.Scale | undefined;
  markers: L.Marker[];
}>({
  loaded: false,
  map: undefined,
  tileLayer: undefined,
  scale: undefined,
  markers: [],
});

interface UseLeafletOptions {
  container: Ref<HTMLElement | undefined>;
  mapOptions: L.MapOptions;
  scaleOptions: L.Control.ScaleOptions;

  tileLayerOptions: L.TileLayerOptions & {url: string};
}

const load = async () => {
  if (state.loaded) return;

  const css = (await fetch('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css')).text();

  useStyleTag(await css);

  const tag = useScriptTag('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
  await tag.load();
};

const createMap = (options: UseLeafletOptions) => {
  if (state.loaded) return;

  const {mapOptions, tileLayerOptions, container} = options;

  state.map = new L.Map(container.value, mapOptions);
  state.tileLayer = new L.TileLayer(tileLayerOptions.url, tileLayerOptions);
  state.scale = new L.Control.Scale(options.scaleOptions);
  state.markers = [];

  state.loaded = true;
};

export const useLeaflet = () => {
  void load();

  return {
    load,
    createMap,
    ...state,
  };
};
