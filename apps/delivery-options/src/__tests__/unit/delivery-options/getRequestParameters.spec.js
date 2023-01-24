import * as CONFIG from '@/data/keys/configKeys';
import * as PLATFORMS from '@/data/keys/platformKeys';
import { DEFAULT_PLATFORM } from '@/data/keys/settingsConsts';
import MockDate from 'mockdate';
import { defaultAddress } from '@/data/defaultAddress';
import { getDefaultRequestParameters } from '../../data/request/getDefaultRequestParameters';
import { getOptionalRequestParameters } from '../../data/request/getOptionalRequestParameters';
import { getParametersByPlatform } from '../../data/request/requestData';
import { mockConfigBus } from './mockConfigBus';

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

    expect(getDefaultRequestParameters(configBus)).toEqual({
      carrier: 'postnl',
      include: 'shipment_options',
      platform: DEFAULT_PLATFORM,
    });
  });

  it('removes undefined parameters', () => {
    const { postalCode, ...address } = defaultAddress[PLATFORMS.MYPARCEL];
    configBus = mockConfigBus({ address });
    configBus.$data.currentCarrier = 'postnl';

    expect(getDefaultRequestParameters(configBus))
      .toEqual({
        carrier: 'postnl',
        include: 'shipment_options',
        platform: PLATFORMS.MYPARCEL,
        ...address,
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
});
