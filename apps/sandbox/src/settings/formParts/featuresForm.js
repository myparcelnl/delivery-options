import { CONFIG, CONSTS } from '@myparcel/delivery-options';
import CCodeEditor from '../../components/form/CCodeEditor.vue';
import CNumber from '../../components/form/CNumber.vue';
import CSelect from '../../components/form/CNumber.vue';
import CToggle from '../../components/form/CNumber.vue';
import { inAnyCarrier } from '../conditions/inAnyCarrier';

export const featuresForm = [
  {
    key: CONFIG.KEY,
    component: CToggle,
    name: CONFIG.FEATURE_ALLOW_RETRY,
  },
  {
    key: CONFIG.KEY,
    name: CONFIG.FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW,
    component: CSelect,
    props: {
      options: CONSTS.PICKUP_LOCATIONS_VIEWS,
    },
    conditions: [
      inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
    ],
  },
  {
    key: CONFIG.KEY,
    component: CToggle,
    name: CONFIG.FEATURE_PICKUP_SHOW_DISTANCE,
    conditions: [
      inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
    ],
  },
  {
    key: CONFIG.KEY,
    component: CCodeEditor,
    name: CONFIG.PICKUP_LOCATIONS_MAP_TILE_LAYER_DATA,
    conditions: [
      inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
    ],
  },
  {
    key: CONFIG.KEY,
    component: CNumber,
    name: CONFIG.FEATURE_MAX_PAGE_ITEMS,
    props: {
      min: CONSTS.PICKUP_MIN_PAGE_ITEMS_LIMIT,
      max: CONSTS.PICKUP_MAX_PAGE_ITEMS_LIMIT,
    },
    conditions: [
      inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
    ],
  },
];
