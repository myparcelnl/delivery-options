import {beforeEach, describe, expect, it} from 'vitest';
import {assign} from 'radash';
import {createPinia, setActivePinia} from 'pinia';
import {CarrierName, DeliveryTypeName, PackageTypeName, ShipmentOptionName} from '@myparcel/constants';
import {type DeliveryOptionsOutput, type InternalOutput, type SelectedDeliveryMoment} from '../types';
import {mockDeliveryOptionsConfig} from '../__tests__';
import {convertOutput} from './convertOutput';

const DEFAULT_INTERNAL_OUTPUT = Object.freeze({
  deliveryDate: '2021-01-01',
  deliveryMoment: JSON.stringify({
    carrier: CarrierName.PostNl,
    deliveryType: DeliveryTypeName.Standard,
    packageType: PackageTypeName.Package,
  }),
  shipmentOptions: [],
}) satisfies InternalOutput;

const DEFAULT_OUTPUT = Object.freeze({
  carrier: CarrierName.PostNl,
  date: '2021-01-01',
  deliveryType: DeliveryTypeName.Standard,
  isPickup: false,
  packageType: PackageTypeName.Package,
  shipmentOptions: {
    onlyRecipient: false,
    signature: false,
  },
}) satisfies DeliveryOptionsOutput;

describe('convertOutput', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it.each([
    [DEFAULT_INTERNAL_OUTPUT, DEFAULT_OUTPUT],
    [
      {shipmentOptions: [ShipmentOptionName.Signature, ShipmentOptionName.OnlyRecipient]},
      {
        shipmentOptions: {
          onlyRecipient: true,
          signature: true,
        },
      },
    ],

    [
      {
        deliveryMoment: JSON.stringify({
          ...JSON.parse(DEFAULT_INTERNAL_OUTPUT.deliveryMoment),
          carrier: CarrierName.DhlForYou,
          deliveryType: DeliveryTypeName.Morning,
        } satisfies Partial<SelectedDeliveryMoment>),
      },
      {
        carrier: CarrierName.DhlForYou,
        deliveryType: DeliveryTypeName.Morning,
      },
    ],
  ] satisfies [Partial<InternalOutput>, Partial<DeliveryOptionsOutput>][])(
    'converts internal output to external output',
    (internalOutput, expectedOutput) => {
      const output = convertOutput(assign(DEFAULT_INTERNAL_OUTPUT, internalOutput) as InternalOutput);

      expect(output).toEqual(assign(DEFAULT_OUTPUT, expectedOutput));
    },
  );

  it('should not expose delivery date if it is disabled', () => {
    mockDeliveryOptionsConfig({
      config: {
        showDeliveryDate: false,
      },
    });

    const output = convertOutput(DEFAULT_INTERNAL_OUTPUT);

    expect(output.date).toBeUndefined();
  });
});
