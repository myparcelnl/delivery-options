import * as ADDRESS from '@/data/keys/addressKeys';
import * as CONFIG from '@/data/keys/configKeys';
import * as PLATFORMS from '@/data/keys/platformKeys';
import { BPOST, DHL, DHL_EUROPLUS, DHL_FOR_YOU, DHL_PARCEL_CONNECT, DPD, POSTNL } from '@/data/keys/carrierKeys';
import { DEFAULT_PLATFORM } from '@/data/keys/settingsConsts';
import MockDate from 'mockdate';
import { defaultAddress } from '@/data/defaultAddress';
import { getDefaultRequestParameters } from '@/delivery-options/data/request/getDefaultRequestParameters';
import { getOptionalRequestParameters } from '@/delivery-options/data/request/getOptionalRequestParameters';
import { getParametersByPlatform } from '@/delivery-options/data/request/requestData';
import { mockConfigBus } from './mockConfigBus';
import { CarrierConfigurationFactory } from '@/data/carriers/carrierConfigurationFactory';
import { MYPARCEL } from '@/data/keys/platformKeys';

const tuesday = '2020-03-10T00:00:00';
const friday = '2020-03-13T00:00:00';
const saturday = '2020-03-14T00:00:00';

let configBus;

const getFirstCarrier = (configBus) => Object.keys(configBus.get(CONFIG.CARRIER_SETTINGS))[0];

describe('Request parameters', () => {
  beforeAll(() => {
    configBus = mockConfigBus();
  });

  it('gets the correct default parameters', () => {
    const configBus = mockConfigBus({ address: {} });
    configBus.currentCarrier = getFirstCarrier(configBus);

    expect(getDefaultRequestParameters(configBus, CarrierConfigurationFactory.create(configBus.currentCarrier, MYPARCEL))).toEqual({
      carrier: 'postnl',
      include: 'shipment_options',
      platform: DEFAULT_PLATFORM,
    });
  });

  it('removes undefined parameters', () => {
    const { postalCode, ...address } = defaultAddress[PLATFORMS.MYPARCEL];
    configBus = mockConfigBus({ address });
    configBus.$data.currentCarrier = 'postnl';
    const carrierConfiguration = CarrierConfigurationFactory.create('postnl', 'myparcel');

    const { street, ...withoutStreet } = address;

    expect(getDefaultRequestParameters(configBus, carrierConfiguration))
      .toEqual({
        carrier: 'postnl',
        include: 'shipment_options',
        platform: PLATFORMS.MYPARCEL,
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
      [CONFIG.KEY]: {
        [CONFIG.PLATFORM]: PLATFORMS.SENDMYPARCEL,
        [CONFIG.DROP_OFF_DAYS]: [4, 5],
        [CONFIG.CUTOFF_TIME]: '15:00',
        [CONFIG.FRIDAY_CUTOFF_TIME]: '12:00',
      },
    });

    // Arbitrary non-friday day
    MockDate.set(tuesday);
    expect(getParametersByPlatform(sendMyParcelConfigBus)).toEqual({
      cutoff_time: '15:00',
      deliverydays_window: 1,
      saturday_delivery: 1,
    });

    MockDate.set(friday);
    expect(getParametersByPlatform(sendMyParcelConfigBus)).toEqual({
      cutoff_time: '12:00',
      deliverydays_window: 1,
      saturday_delivery: 1,
    });

    MockDate.reset();
  });

  it('gets the correct cutoff time for myparcel when using monday delivery', () => {
    const myParcelConfigBus = mockConfigBus({
      [CONFIG.KEY]: {
        [CONFIG.PLATFORM]: PLATFORMS.MYPARCEL,
        [CONFIG.DROP_OFF_DAYS]: [4, 5, 6],
        [CONFIG.CUTOFF_TIME]: '15:00',
        [CONFIG.SATURDAY_CUTOFF_TIME]: '12:00',
      },
    });

    // Arbitrary non-saturday day
    MockDate.set(tuesday);
    expect(getParametersByPlatform(myParcelConfigBus)).toEqual({
      cutoff_time: '15:00',
      monday_delivery: 1,
    });

    MockDate.set(saturday);
    expect(getParametersByPlatform(myParcelConfigBus)).toEqual({
      cutoff_time: '12:00',
      monday_delivery: 1,
    });

    MockDate.reset();
  });

  it.each`
    carrier               | platform                  | expected
    ${POSTNL}             | ${PLATFORMS.MYPARCEL}     | ${['postal_code', 'city', 'street']}
    ${POSTNL}             | ${PLATFORMS.SENDMYPARCEL} | ${['postal_code', 'city', 'street']}
    ${BPOST}              | ${PLATFORMS.SENDMYPARCEL} | ${['postal_code', 'city']}
    ${DPD}                | ${PLATFORMS.SENDMYPARCEL} | ${['postal_code', 'street']}
    ${DHL}                | ${PLATFORMS.MYPARCEL}     | ${['postal_code', 'city']}
    ${DHL_FOR_YOU}        | ${PLATFORMS.MYPARCEL}     | ${['postal_code', 'city']}
    ${DHL_EUROPLUS}       | ${PLATFORMS.MYPARCEL}     | ${['postal_code', 'city', 'street']}
    ${DHL_PARCEL_CONNECT} | ${PLATFORMS.MYPARCEL}     | ${['postal_code', 'city', 'street']}
  `('gets address parts $expected when using carrier $carrier on platform $platform', ({
    carrier,
    platform,
    expected,
  }) => {
    const configBus = mockConfigBus({
      [ADDRESS.KEY]: defaultAddress[platform],
      [CONFIG.KEY]: {
        [CONFIG.PLATFORM]: platform,
        [CONFIG.CARRIER_SETTINGS]: {
          [carrier]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
          },
        },
      },
    });

    configBus.currentCarrier = getFirstCarrier(configBus);
    const parameters = getDefaultRequestParameters(configBus, CarrierConfigurationFactory.create(configBus.currentCarrier, MYPARCEL));

    expect(Object.keys(parameters).sort()).toEqual([
      'include',
      'platform',
      'carrier',
      'cc',
      ...expected,
    ].sort());
  });
});
