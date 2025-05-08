import {describe, it, expect} from 'vitest';
import {CarrierSetting} from '@myparcel-do/shared';
import {ShipmentOptionName, PackageTypeName} from '@myparcel/constants';
import {type UseResolvedCarrier} from './useResolvedCarrier';
import {createFakeShipmentOptions} from './useFakeShipmentOptions';

describe('createFakeShipmentOptions', () => {
  const mockCarrier = (
    features: CarrierSetting[],
    shipmentOptions: ShipmentOptionName[],
    packageTypes: string[],
  ): UseResolvedCarrier =>
    ({
      features: new Set(features),
      shipmentOptionsPerPackageType: {
        package: new Set(shipmentOptions),
      },
      config: {
        value: {
          packageTypes,
        },
      },
      carrier: {value: {identifier: 'mockCarrier'}},
    } as unknown as UseResolvedCarrier);

  it('returns shipment options when carrier supports signature and only recipient', () => {
    const carrier = mockCarrier(
      [CarrierSetting.AllowSignature, CarrierSetting.AllowOnlyRecipient],
      [ShipmentOptionName.Signature, ShipmentOptionName.OnlyRecipient],
      [PackageTypeName.Package],
    );

    const result = createFakeShipmentOptions(carrier, PackageTypeName.Package);

    expect(result).toEqual([
      {
        name: ShipmentOptionName.Signature,
        schema: {
          enum: [false, true],
          default: false,
          type: 'boolean',
        },
      },
      {
        name: ShipmentOptionName.OnlyRecipient,
        schema: {
          enum: [false, true],
          default: false,
          type: 'boolean',
        },
      },
    ]);
  });

  it('returns only signature option when only signature is supported', () => {
    const carrier = mockCarrier([CarrierSetting.AllowSignature], [ShipmentOptionName.Signature], ['packageTypeA']);

    const result = createFakeShipmentOptions(carrier, PackageTypeName.Package);

    expect(result).toEqual([
      {
        name: ShipmentOptionName.Signature,
        schema: {
          enum: [false, true],
          default: false,
          type: 'boolean',
        },
      },
    ]);
  });

  it('returns empty array when no shipment options are supported', () => {
    const carrier = mockCarrier([], [], ['packageTypeA']);

    const result = createFakeShipmentOptions(carrier, PackageTypeName.Package);

    expect(result).toEqual([]);
  });

  it('returns empty array when package type is not configured', () => {
    const carrier = mockCarrier(
      [CarrierSetting.AllowSignature, CarrierSetting.AllowOnlyRecipient],
      [ShipmentOptionName.Signature, ShipmentOptionName.OnlyRecipient],
      [],
    );

    const result = createFakeShipmentOptions(carrier, PackageTypeName.Letter);

    expect(result).toEqual([]);
  });
});
