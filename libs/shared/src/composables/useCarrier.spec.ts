import {describe, it, expect} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {useCarrier, CustomDeliveryType} from '@myparcel-dev/do-shared';
import {CarrierName, DeliveryTypeName, ShipmentOptionName} from '@myparcel-dev/constants';

const DEFAULT_API_BASE_URL = 'https://api.myparcel.nl';
const DEFAULT_COUNTRY = 'NL';

describe('useCarrier', () => {
  it('returns delivery types from capabilities for PostNL', async () => {
    const carrier = useCarrier({
      carrierIdentifier: CarrierName.PostNl,
      apiBaseUrl: DEFAULT_API_BASE_URL,
      countryCode: DEFAULT_COUNTRY,
    });

    await flushPromises();

    expect(carrier.deliveryTypes.value).toEqual(
      new Set([
        CustomDeliveryType.Monday,
        DeliveryTypeName.Standard,
        DeliveryTypeName.Morning,
        DeliveryTypeName.Evening,
        DeliveryTypeName.Pickup,
      ]),
    );
  });

  it('returns shipment options from capabilities for PostNL', async () => {
    const carrier = useCarrier({
      carrierIdentifier: CarrierName.PostNl,
      apiBaseUrl: DEFAULT_API_BASE_URL,
      countryCode: DEFAULT_COUNTRY,
    });

    await flushPromises();

    expect(carrier.shipmentOptions.value).toEqual(
      new Set([ShipmentOptionName.Signature, ShipmentOptionName.OnlyRecipient, ShipmentOptionName.PriorityDelivery]),
    );
  });

  it('returns delivery types from capabilities for DHL For You', async () => {
    const carrier = useCarrier({
      carrierIdentifier: CarrierName.DhlForYou,
      apiBaseUrl: DEFAULT_API_BASE_URL,
      countryCode: DEFAULT_COUNTRY,
    });

    await flushPromises();

    expect(carrier.deliveryTypes.value).toContain(DeliveryTypeName.Standard);
    expect(carrier.deliveryTypes.value).toContain(DeliveryTypeName.Evening);
    expect(carrier.deliveryTypes.value).toContain(DeliveryTypeName.Pickup);
  });
});
