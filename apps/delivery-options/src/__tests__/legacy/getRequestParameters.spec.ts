import {beforeAll, describe, expect, it, vi} from 'vitest';
import {DEFAULT_PLATFORM, getCarrierConfiguration, KEY_CARRIER_SETTINGS} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';

describe.skip('Request parameters', () => {
  const tuesday = '2020-03-10T00:00:00';
  const friday = '2020-03-13T00:00:00';
  const saturday = '2020-03-14T00:00:00';

  let configBus;

  const getFirstCarrier = (configBus) => Object.keys(configBus.get(KEY_CARRIER_SETTINGS))[0];

  beforeAll(() => {
    configBus = mockConfigBus();
  });

  it('gets the correct default parameters', () => {
    const configBus = mockConfigBus({address: {}});
    configBus.currentCarrier = getFirstCarrier(configBus);

    expect(
      getDefaultRequestParameters(configBus, getCarrierConfiguration(configBus.currentCarrier, PlatformName.MyParcel)),
    ).toEqual({
      carrier: 'postnl',
      include: 'shipment_options',
      platform: DEFAULT_PLATFORM,
    });
  });

  it('removes undefined parameters', () => {
    const {postalCode, ...address} = defaultAddress[PlatformName.MyParcel];
    configBus = mockConfigBus({address});
    configBus.$data.currentCarrier = 'postnl';
    const carrierConfiguration = getCarrierConfiguration(CarrierName.PostNl, PlatformName.MyParcel);

    const {street, ...withoutStreet} = address;

    expect(getDefaultRequestParameters(configBus, carrierConfiguration)).toEqual({
      carrier: 'postnl',
      include: 'shipment_options',
      platform: PlatformName.MyParcel,
      street: 'Antareslaan 31',
      ...withoutStreet,
    });
  });

  it('gets the correct optional parameters', () => {
    const configBus = mockConfigBus();

    expect(getOptionalRequestParameters(configBus)).toEqual({
      deliverydays_window: 7,
      dropoff_days: '1;2;3;4;5',
      dropoff_delay: 0,
    });
  });

  it('gets the correct cutoff time for sendmyparcel when using saturday delivery', () => {
    const sendMyParcelConfigBus = mockConfigBus({
      [KEY_CONFIG]: {
        [PLATFORM]: PlatformName.SendMyParcel,
        [DROP_OFF_DAYS]: [4, 5],
        [CUTOFF_TIME]: '15:00',
        [FRIDAY_CUTOFF_TIME]: '12:00',
      },
    });

    // Arbitrary non-friday day
    vi.setSystemTime(tuesday);
    expect(getParametersByPlatform(sendMyParcelConfigBus)).toEqual({
      cutoff_time: '15:00',
      deliverydays_window: 1,
      saturday_delivery: 1,
    });

    vi.setSystemTime(friday);
    expect(getParametersByPlatform(sendMyParcelConfigBus)).toEqual({
      cutoff_time: '12:00',
      deliverydays_window: 1,
      saturday_delivery: 1,
    });

    vi.setSystemTime(vi.getRealSystemTime());
  });

  it('gets the correct cutoff time for myparcel when using monday delivery', () => {
    const myParcelConfigBus = mockConfigBus({
      [KEY_CONFIG]: {
        [PLATFORM]: PlatformName.MyParcel,
        [DROP_OFF_DAYS]: [4, 5, 6],
        [CUTOFF_TIME]: '15:00',
        [SATURDAY_CUTOFF_TIME]: '12:00',
      },
    });

    // Arbitrary non-saturday day
    vi.setSystemTime(tuesday);
    expect(getParametersByPlatform(myParcelConfigBus)).toEqual({
      cutoff_time: '15:00',
      monday_delivery: 1,
    });

    vi.setSystemTime(saturday);
    expect(getParametersByPlatform(myParcelConfigBus)).toEqual({
      cutoff_time: '12:00',
      monday_delivery: 1,
    });

    vi.setSystemTime(vi.getRealSystemTime());
  });

  it.each`
    carrier                         | platform                     | expected
    ${CarrierName.PostNl}           | ${PlatformName.MyParcel}     | ${['postal_code', 'city', 'street']}
    ${CarrierName.PostNl}           | ${PlatformName.SendMyParcel} | ${['postal_code', 'city', 'street']}
    ${CarrierName.Bpost}            | ${PlatformName.SendMyParcel} | ${['postal_code', 'city']}
    ${CarrierName.Dpd}              | ${PlatformName.SendMyParcel} | ${['postal_code', 'city', 'street']}
    ${CarrierName.Dhl}              | ${PlatformName.MyParcel}     | ${['postal_code', 'city']}
    ${CarrierName.DhlForYou}        | ${PlatformName.MyParcel}     | ${['postal_code', 'city']}
    ${CarrierName.DhlEuroPlus}      | ${PlatformName.MyParcel}     | ${['postal_code', 'city', 'street']}
    ${CarrierName.DhlParcelConnect} | ${PlatformName.MyParcel}     | ${['postal_code', 'city', 'street']}
  `(
    'gets address parts $expected when using carrier $carrier on platform $platform',
    ({carrier, platform, expected}) => {
      const configBus = mockConfigBus({
        [KEY_ADDRESS]: defaultAddress[platform],
        [KEY_CONFIG]: {
          [PLATFORM]: platform,
          [KEY_CARRIER_SETTINGS]: {
            [carrier]: {
              [ALLOW_DELIVERY_OPTIONS]: true,
            },
          },
        },
      });

      configBus.currentCarrier = getFirstCarrier(configBus);
      const parameters = getDefaultRequestParameters(
        configBus,
        getCarrierConfiguration(configBus.currentCarrier, MYPARCEL),
      );

      expect(Object.keys(parameters).sort()).toEqual(['include', 'platform', 'carrier', 'cc', ...expected].sort());
    },
  );
});
