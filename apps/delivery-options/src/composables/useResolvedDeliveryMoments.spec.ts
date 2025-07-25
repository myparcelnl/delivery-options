import {ref, nextTick} from 'vue';
import {describe, it, expect, beforeEach, vi} from 'vitest';
import {CarrierName} from '@myparcel/constants';
import {FIELD_CARRIER, FIELD_DELIVERY_DATE, FIELD_DELIVERY_MOMENT} from '../data';
import {useSelectedValues} from './useSelectedValues';
import {useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';
import {useResolvedDeliveryMoments} from './useResolvedDeliveryMoments';

// Mock the dependencies
vi.mock('./useResolvedDeliveryOptions');
// vi.mock('./useSelectedValues');

const mockUseResolvedDeliveryOptions = vi.mocked(useResolvedDeliveryOptions);
// const mockUseSelectedValues = vi.mocked(useSelectedValues);

describe('useResolvedDeliveryMoments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty array while still loading', async () => {
    mockUseResolvedDeliveryOptions.mockReturnValue({loading: ref(true), value: ref([])});

    const deliveryMoments = useResolvedDeliveryMoments();

    expect(deliveryMoments.value).toEqual([]);
  });

  it('should filter delivery options by selected date', async () => {
    // Arrange
    const mockDeliveryOptions = [
      {
        carrier: CarrierName.PostNl,
        date: '2025-01-28',
        time: '09:00-17:00',
        deliveryType: 'standard',
        packageType: 'package',
        shipmentOptions: [],
      },
      {
        carrier: CarrierName.PostNl,
        date: '2025-01-28',
        time: '18:00-22:00',
        deliveryType: 'standard',
        packageType: 'package',
        shipmentOptions: [],
      },
      {
        carrier: CarrierName.PostNl,
        date: '2025-01-29',
        time: '09:00-17:00',
        deliveryType: 'standard',
        packageType: 'package',
        shipmentOptions: [],
      },
      {
        carrier: CarrierName.Dhl,
        date: '2025-01-28',
        time: '09:00-17:00',
        deliveryType: 'standard',
        packageType: 'package',
        shipmentOptions: [],
      },
    ];

    mockUseResolvedDeliveryOptions.mockReturnValue({loading: ref(false), value: mockDeliveryOptions});
    const selectedValues = useSelectedValues();
    selectedValues[FIELD_CARRIER].value = CarrierName.PostNl;
    selectedValues[FIELD_DELIVERY_DATE].value = '2025-01-28';
    const deliveryMoments = useResolvedDeliveryMoments();

    // Assert
    expect(deliveryMoments.value).toHaveLength(3);
    expect(deliveryMoments.value[0].carrier).toBe('postnl');
  });

  it('should always include items without dates', async () => {
    // Arrange
    const mockDeliveryOptions = [
      {
        carrier: CarrierName.PostNl,
        date: '2025-01-28',
        time: '09:00-17:00',
        deliveryType: 'standard',
        packageType: 'package',
        shipmentOptions: [],
      },
      {
        carrier: CarrierName.Gls,
        date: undefined,
        time: undefined,
        deliveryType: 'standard',
        packageType: 'package',
        shipmentOptions: [],
      },
      {
        carrier: CarrierName.PostNl,
        date: '2025-01-29',
        time: '09:00-17:00',
        deliveryType: 'standard',
        packageType: 'package',
        shipmentOptions: [],
      },
      {
        carrier: CarrierName.Dhl,
        date: '2025-01-28',
        time: '09:00-17:00',
        deliveryType: 'standard',
        packageType: 'package',
        shipmentOptions: [],
      },
    ];

    mockUseResolvedDeliveryOptions.mockReturnValue({loading: ref(false), value: mockDeliveryOptions});
    const selectedValues = useSelectedValues();
    selectedValues[FIELD_CARRIER].value = CarrierName.PostNl;
    selectedValues[FIELD_DELIVERY_DATE].value = '2025-01-28';
    const deliveryMoments = useResolvedDeliveryMoments();

    // Assert
    expect(deliveryMoments.value).toHaveLength(3);
    expect(deliveryMoments.value[0].carrier).toBe('postnl');
  });
});
