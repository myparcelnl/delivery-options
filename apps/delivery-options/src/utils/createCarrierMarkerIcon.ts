// noinspection HtmlUnknownTarget

// eslint-disable-next-line id-length
import {useMemoize} from '@vueuse/core';
import {createAssetUrl} from '@myparcel-dev/do-shared';
import {type Carrier} from '@myparcel-dev/sdk';

const CARRIER_MARKER_TEMPLATE = `
  <div class="mp-relative mp-w-12">
    <svg viewBox="0 0 77 92" class="mp-drop-shadow">
      <path d="M77 38.3333C77 61.4209 38.5 92 38.5 92C38.5 92 0 61.4209 0 38.3333C0 17.1624 17.237 0 38.5 0C59.763 0 77 17.1624 77 38.3333Z" fill="#FFF"/>
      <circle cx="38.5" cy="38.3333" r="30.8" fill="#FFF"/>
    </svg>

    <div class="mp-absolute mp-inset-0 mp-mt-3">
      <div class="mp-m-auto mp-w-6 mp-h-6 mp-flex">
        <img src="{iconUrl}" alt="{iconAlt}" class="mp-m-auto" style="max-width: 100% !important; max-height: 100% !important;" />
      </div>
    </div>
  </div>`;

export const createCarrierMarkerIcon = useMemoize(
  (carrier: Carrier): string => {
    return L.Util.template(CARRIER_MARKER_TEMPLATE, {
      iconAlt: carrier.human,
      iconUrl: createAssetUrl(carrier.meta.logo_svg),
    });
  },
  {getKey: (carrier: Carrier) => carrier.name},
);
