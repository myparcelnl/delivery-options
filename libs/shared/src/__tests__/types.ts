import {type Mock} from 'vitest';
import {type PromiseOr} from '@myparcel/ts-utils';
import {type AbstractEndpoint, type Options, type EndpointResponse} from '@myparcel-dev/sdk';
import {type CarrierIdentifier, type SupportedPlatformName, type Weekday} from '../types';

export interface MockDeliveryOptionsParameters {
  carrier: CarrierIdentifier;
  cutoffTime?: string;
  deliveryDaysWindow?: number;
  dropOffDays?: Weekday[];
  dropOffDelay?: number;
  mondayDelivery?: boolean | undefined;
  platform: SupportedPlatformName;
  saturdayDelivery?: boolean | undefined;
}

export type ResolvedMockDeliveryOptionsParameters = Required<MockDeliveryOptionsParameters>;

export interface ExtraDelivery {
  cutoffTime: string;
  deliveryDay: Weekday;
  dropOffDay: Weekday;
  feature: string;
}

export type SdkMock<E extends AbstractEndpoint> = Mock<
  (endpoint: E, options: Options<E>) => PromiseOr<EndpointResponse<E>>
>;
