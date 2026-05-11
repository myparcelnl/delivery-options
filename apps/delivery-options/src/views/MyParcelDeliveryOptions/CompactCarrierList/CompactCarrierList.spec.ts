import {Suspense, defineComponent, h} from 'vue';
import {describe, it, expect, beforeEach} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {flushPromises} from '@vue/test-utils';
import {render, fireEvent} from '@testing-library/vue';
import {
  KEY_CONFIG,
  KEY_CARRIER_SETTINGS,
  ConfigSetting,
  CarrierSetting,
  KEY_STRINGS,
  COMPACT_DELIVERY,
  COMPACT_PICKUP,
} from '@myparcel-dev/do-shared';
import {CarrierName} from '@myparcel-dev/constants';
import {HOME_OR_PICKUP_HOME, HOME_OR_PICKUP_PICKUP} from '../../../data';
import {useActiveCarriers, useLanguage, useSelectedValues} from '../../../composables';
import {mockDeliveryOptionsConfig, getMockDeliveryOptionsConfiguration} from '../../../__tests__';
import CompactCarrierList from './CompactCarrierList.vue';

const renderWithSuspense = () => {
  const Wrapper = defineComponent({
    render: () => h(Suspense, null, {default: () => h(CompactCarrierList)}),
  });
  return render(Wrapper);
};

describe('CompactCarrierList.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    useActiveCarriers.clear();

    const strings = {
      [COMPACT_DELIVERY]: 'Thuisbezorgen',
      [COMPACT_PICKUP]: 'Afhalen op locatie',
    };

    useLanguage().setStrings(strings);

    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [ConfigSetting.CompactView]: true,
          [KEY_CARRIER_SETTINGS]: {
            [CarrierName.PostNl]: {
              [CarrierSetting.AllowStandardDelivery]: true,
              [CarrierSetting.AllowPickupLocations]: true,
            },
            [CarrierName.DhlForYou]: {
              [CarrierSetting.AllowStandardDelivery]: true,
              [CarrierSetting.AllowPickupLocations]: false,
            },
          },
        },
        [KEY_STRINGS]: strings,
      }),
    );
  });

  it('renders one item per carrier-with-delivery and per carrier-with-pickup', async () => {
    const {findAllByRole} = renderWithSuspense();
    await flushPromises();

    // PostNL has delivery + pickup, DHL has delivery only → 3 buttons total
    const buttons = await findAllByRole('button');
    expect(buttons.length).toBe(3);
  });

  it('renders carrier human name and type label as separate text', async () => {
    const {findAllByText} = renderWithSuspense();
    await flushPromises();

    // Carrier name appears twice for PostNL (once for delivery row, once for pickup row)
    const postnlMatches = await findAllByText(/^PostNL$/);
    expect(postnlMatches.length).toBe(2);

    // Type labels rendered as plain text (no carrier interpolation)
    const deliveryMatches = await findAllByText(/^Thuisbezorgen$/);
    expect(deliveryMatches.length).toBe(2); // PostNL + DHL delivery rows

    const pickupMatches = await findAllByText(/^Afhalen op locatie$/);
    expect(pickupMatches.length).toBe(1); // PostNL pickup only (DHL has pickup disabled)
  });

  it('clicking a delivery item sets carrier and homeOrPickup=HOME', async () => {
    const {findByTestId} = renderWithSuspense();
    await flushPromises();

    const button = await findByTestId(`compact-item-${CarrierName.PostNl}__home`);
    await fireEvent.click(button);
    await flushPromises();

    const {carrier, homeOrPickup} = useSelectedValues();
    expect(carrier.value).toBe(CarrierName.PostNl);
    expect(homeOrPickup.value).toBe(HOME_OR_PICKUP_HOME);
  });

  it('clicking a pickup item sets carrier and homeOrPickup=PICKUP', async () => {
    const {findByTestId} = renderWithSuspense();
    await flushPromises();

    const button = await findByTestId(`compact-item-${CarrierName.PostNl}__pickup`);
    await fireEvent.click(button);
    await flushPromises();

    const {carrier, homeOrPickup} = useSelectedValues();
    expect(carrier.value).toBe(CarrierName.PostNl);
    expect(homeOrPickup.value).toBe(HOME_OR_PICKUP_PICKUP);
  });

  it('renders empty when no active carriers', async () => {
    setActivePinia(createPinia());
    useActiveCarriers.clear();

    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [ConfigSetting.CompactView]: true,
          [KEY_CARRIER_SETTINGS]: {},
        },
      }),
    );

    const {queryAllByRole} = renderWithSuspense();
    await flushPromises();

    expect(queryAllByRole('button')).toHaveLength(0);
  });
});
