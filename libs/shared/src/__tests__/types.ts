import {type SupportedPlatformName} from '@myparcel-do/shared';
import {type CarrierIdentifier} from '../types';

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