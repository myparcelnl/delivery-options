// noinspection HtmlUnknownTarget

// eslint-disable-next-line id-length
import L from 'leaflet';
import {useMemoize} from '@vueuse/core';
import {createAssetUrl, type FullCarrier} from '@myparcel-do/shared';

export const createCarrierMarkerIcon = useMemoize((carrier: FullCarrier): string => {
  return L.Util.template(
    `
<div class="mp-relative mp-w-12">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178" class="mp-drop-shadow">
      <path fill="#FFF" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z" />
      <circle fill="#FFF" cx="74" cy="75" r="61" />
      <circle fill="#FFF" cx="74" cy="75" r="40" />
    </svg>
    <div class="mp-absolute mp-inset-0 mp-w-8 mp-m-auto mp-h-12 mp-top-2">
      <img src="{iconUrl}" alt="{iconAlt}"  style="max-width: 100% !important; max-height: 100% !important;" />
    </div>
  </div>`,
    {
      iconAlt: carrier.human ?? '',
      iconUrl: createAssetUrl(carrier.meta.logo_svg),
    },
  );
});
