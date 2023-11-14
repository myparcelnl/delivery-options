import {CONFIG, CONSTS, KEY_CONFIG} from '@myparcel-do/shared';
import {inAnyCarrier} from '../conditions/inAnyCarrier';

export const featuresForm = [
  {
    key: KEY_CONFIG,
    component: CToggle,
    name: CONFIG.FEATURE_ALLOW_RETRY,
  },
  {
    key: KEY_CONFIG,
    name: CONFIG.FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW,
    component: CSelect,
    props: {
      options: CONSTS.PICKUP_LOCATIONS_VIEWS,
    },
    conditions: [inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS)],
  },
  {
    key: KEY_CONFIG,
    component: CToggle,
    name: CONFIG.FEATURE_PICKUP_SHOW_DISTANCE,
    conditions: [inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS)],
  },
  {
    key: KEY_CONFIG,
    component: CCodeEditor,
    name: CONFIG.PICKUP_LOCATIONS_MAP_TILE_LAYER_DATA,
    conditions: [inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS)],
  },
  {
    key: KEY_CONFIG,
    component: CNumber,
    name: CONFIG.FEATURE_MAX_PAGE_ITEMS,
    props: {
      min: CONSTS.PICKUP_MIN_PAGE_ITEMS_LIMIT,
      max: CONSTS.PICKUP_MAX_PAGE_ITEMS_LIMIT,
    },
    conditions: [inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS)],
  },
];
