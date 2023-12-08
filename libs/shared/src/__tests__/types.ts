import {type Mock} from 'vitest';
import {type AbstractEndpoint, type EndpointResponse, type Options} from '@myparcel/sdk';
import {type CarrierIdentifier, type SupportedPlatformName} from '../types';

export interface FakeDeliveryOptionsParameters {
  carrier: CarrierIdentifier;
  cutoffTime: string;
  deliveryDaysWindow: number;
  dropOffDays: number[];
  dropOffDelay: number;
  mondayDelivery: boolean | undefined;
  platform: SupportedPlatformName;
  saturdayDelivery: boolean | undefined;
}

export interface ExtraDelivery {
  cutoffTime: string;
  deliveryDay: number;
  dropOffDay: number;
  feature: string;
}

export type SdkMock<E extends AbstractEndpoint> = Mock<[E, Options<E>], EndpointResponse<E>>;
