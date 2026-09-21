import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {createPinia} from 'pinia';
import {flushPromises} from '@vue/test-utils';
import {render, fireEvent} from '@testing-library/vue';
import {mockCapabilitiesFetch, MOCK_CAPABILITIES} from '@myparcel-dev/do-shared/testing';
import {KEY_CONFIG, KEY_CARRIER_SETTINGS, ConfigSetting, CarrierSetting} from '@myparcel-dev/do-shared';
import {CarrierName} from '@myparcel-dev/constants';
import MyParcelDeliveryOptions from '../MyParcelDeliveryOptions.vue';
import {getResolvedCarrier} from '../../../utils';
import {useConfigStore} from '../../../stores';
import {HOME_OR_PICKUP_HOME, HOME_OR_PICKUP_PICKUP} from '../../../data';
import {setConfiguration} from '../../../config';
import {useResolvedValues} from '../../../composables/events/useResolvedValues';
import {useSelectedValues, useSharedCapabilities} from '../../../composables';
import {getMockDeliveryOptionsConfiguration} from '../../../__tests__';

/**
 * Render the full MyParcelDeliveryOptions component with the given configuration,
 * then set carrier to PostNl so the render-switch shows DeliveryOptionsForm.
 */
const renderForm = async (configuration: ReturnType<typeof getMockDeliveryOptionsConfiguration>) => {
  const result = render(MyParcelDeliveryOptions, {
    global: {plugins: [createPinia()], stubs: {PickupLocationMapWrapper: true, PickupLocationMapModal: true}},
    props: {configuration},
  });

  // Wait for CompactCarrierList (or initial render) to settle
  await flushPromises();

  // Set carrier so MyParcelDeliveryOptions shows DeliveryOptionsForm (not CompactCarrierList)
  const {carrier} = useSelectedValues();
  carrier.value = CarrierName.PostNl;
  await flushPromises();

  return result;
};

describe('DeliveryOptionsForm.vue — terug-knop', () => {
  beforeEach(() => {
    // Reset carrier so each test starts fresh
    const {carrier, deliveryDate} = useSelectedValues();
    carrier.value = undefined;
    deliveryDate.value = undefined;
  });

  const makeConfig = (compactView: boolean) =>
    getMockDeliveryOptionsConfiguration({
      [KEY_CONFIG]: {
        [ConfigSetting.CompactView]: compactView,
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowStandardDelivery]: true,
          },
        },
      },
    });

  it('does not render the back button when compactView=false', async () => {
    const config = makeConfig(false);
    const {queryByTestId} = await renderForm(config);

    expect(queryByTestId('compact-back-button')).toBeNull();
  });

  it('renders the back button when compactView=true', async () => {
    const config = makeConfig(true);
    const {findByTestId} = await renderForm(config);

    expect(await findByTestId('compact-back-button')).toBeTruthy();
  });

  it('clicking the back button fully resets carrier and deliveryDate', async () => {
    const config = makeConfig(true);
    const {findByTestId} = await renderForm(config);

    const {carrier, deliveryDate} = useSelectedValues();
    deliveryDate.value = '2026-05-08';
    // carrier is already set to PostNl by renderForm

    const button = await findByTestId('compact-back-button');
    await fireEvent.click(button);
    await flushPromises();

    expect(carrier.value).toBeUndefined();
    expect(deliveryDate.value).toBeUndefined();
  });
});

describe('DeliveryOptionsForm.vue — cart weight update', () => {
  beforeEach(() => {
    useSelectedValues().clearSelectedValues();
    useConfigStore().reset();
    mockCapabilitiesFetch.mockReset();
  });
  afterEach(() => mockCapabilitiesFetch.mockReset());

  const configForWeight = (value: number | null) =>
    getMockDeliveryOptionsConfiguration({
      config: {
        compactView: false,
        proxyCapabilities: 'https://example.test/capabilities',
        physicalProperties: value === null ? null : {weight: {value, unit: 'g'}},
        carrierSettings: {postnl: {allowPickupLocations: true, allowStandardDelivery: true}},
      },
    });
  const response = (pickup: boolean): Response =>
    ({
      ok: true,
      json: () =>
        Promise.resolve({
          results: MOCK_CAPABILITIES.map((cap) =>
            cap.carrier === 'POSTNL' && !pickup ? {...cap, deliveryTypes: ['STANDARD_DELIVERY']} : cap,
          ),
        }),
    } as Response);

  const selectPickup = async () => {
    const selected = useSelectedValues();
    selected.carrier.value = CarrierName.PostNl;
    selected.homeOrPickup.value = HOME_OR_PICKUP_PICKUP;
    selected.pickupLocation.value = '176688';
    selected.deliveryMoment.value = undefined;
    await flushPromises();
    return selected;
  };

  it.each([15000, null])(
    'clears an unavailable selected pickup, then restores availability at %s without restoring its old location',
    async (nextWeight) => {
      await renderForm(configForWeight(15000));
      const selected = await selectPickup();
      const selectedLocation = selected.pickupLocation.value;
      expect(selectedLocation).toBeDefined();
      const output = useResolvedValues();
      expect(output.value?.isPickup).toBe(true);
      let resolveHeavy: (value: Response) => void = () => undefined;
      mockCapabilitiesFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveHeavy = resolve;
          }),
      );
      setConfiguration(configForWeight(30000));
      await flushPromises();
      expect(useSharedCapabilities().loading.value).toBe(true);
      expect(selected.homeOrPickup.value).toBe(HOME_OR_PICKUP_PICKUP);
      expect(selected.pickupLocation.value).toBe(selectedLocation);
      expect(output.value).toBeUndefined();
      resolveHeavy(response(false));
      await flushPromises();
      expect(selected.homeOrPickup.value).toBe(HOME_OR_PICKUP_HOME);
      expect(selected.pickupLocation.value).toBeUndefined();
      expect(getResolvedCarrier(CarrierName.PostNl).hasPickup.value).toBe(false);
      // The existing home form can select a valid default; it must not emit an incomplete fallback.
      expect(output.value).toMatchObject({
        isPickup: false,
        carrier: CarrierName.PostNl,
        packageType: 'package',
        deliveryType: 'standard',
      });
      expect(output.value).not.toHaveProperty('pickupLocation');
      mockCapabilitiesFetch.mockResolvedValueOnce(response(true));
      setConfiguration(configForWeight(nextWeight));
      await flushPromises();
      expect(getResolvedCarrier(CarrierName.PostNl).hasPickup.value).toBe(true);
      expect(selected.pickupLocation.value).toBeUndefined();
      expect(selected.homeOrPickup.value).toBe(HOME_OR_PICKUP_HOME);
    },
  );

  it('keeps the selected pickup when the updated capabilities still allow it', async () => {
    await renderForm(configForWeight(15000));
    const selected = await selectPickup();
    const selectedLocation = selected.pickupLocation.value;
    expect(selectedLocation).toBeDefined();
    setConfiguration(configForWeight(20000));
    await flushPromises();
    expect(selected.homeOrPickup.value).toBe(HOME_OR_PICKUP_PICKUP);
    expect(selected.pickupLocation.value).toBe(selectedLocation);
    expect(useResolvedValues().value?.isPickup).toBe(true);
  });

  it('keeps the existing pickup flow when another carrier still offers pickup', async () => {
    const config = (value: number) =>
      getMockDeliveryOptionsConfiguration({
        config: {
          compactView: false,
          proxyCapabilities: 'https://example.test/capabilities',
          physicalProperties: {weight: {value, unit: 'g'}},
          carrierSettings: {
            postnl: {allowPickupLocations: true, allowStandardDelivery: true},
            dhlforyou: {allowPickupLocations: true, allowStandardDelivery: true},
          },
        },
      });
    await renderForm(config(15000));
    const selected = await selectPickup();
    mockCapabilitiesFetch.mockResolvedValueOnce(response(false));
    setConfiguration(config(30000));
    await flushPromises();
    expect(selected.homeOrPickup.value).toBe(HOME_OR_PICKUP_PICKUP);
    expect(selected.carrier.value).toBe(CarrierName.DhlForYou);
    expect(selected.pickupLocation.value).toBeDefined();
    expect(useResolvedValues().value).toMatchObject({isPickup: true, carrier: CarrierName.DhlForYou});
  });

  it.each([15000, null])('preserves pickup across an unchanged config update with weight %s', async (weight) => {
    await renderForm(configForWeight(weight));
    const selected = await selectPickup();
    const selectedLocation = selected.pickupLocation.value;
    expect(selectedLocation).toBeDefined();
    const requestCount = mockCapabilitiesFetch.mock.calls.length;
    setConfiguration(configForWeight(weight));
    await flushPromises();
    expect(selected.homeOrPickup.value).toBe(HOME_OR_PICKUP_PICKUP);
    expect(selected.pickupLocation.value).toBe(selectedLocation);
    expect(useResolvedValues().value?.isPickup).toBe(true);
    expect(mockCapabilitiesFetch).toHaveBeenCalledTimes(requestCount);
  });

  it('clears selected pickup without producing home output when no option remains', async () => {
    await renderForm(configForWeight(15000));
    const selected = await selectPickup();
    mockCapabilitiesFetch.mockResolvedValueOnce({ok: true, json: () => Promise.resolve({results: []})} as Response);
    setConfiguration(configForWeight(40000));
    await flushPromises();
    expect(selected.pickupLocation.value).toBeUndefined();
    expect(useResolvedValues().value).toBeUndefined();
    // The SDK date fixtures make separate requests to proxy.example.com.
    const widgetRequests = mockCapabilitiesFetch.mock.calls.filter(
      ([url]) => url === 'https://example.test/capabilities',
    );

    expect(widgetRequests).toHaveLength(2);
    expect(
      widgetRequests.map(([, options]) => JSON.parse(options?.body as string).physicalProperties.weight.value),
    ).toEqual([15000, 40000]);
  });
});
