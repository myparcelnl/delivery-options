import {type RecursivePartial} from '@myparcel/ts-utils';
import {type ResolvedDeliveryOptions, type SelectedDeliveryMoment} from '../../types';
import {mockResolvedDeliveryOption} from './mockResolvedDeliveryOption';

export const mockSelectedDeliveryMoment = (
  option: RecursivePartial<ResolvedDeliveryOptions> = {},
): SelectedDeliveryMoment => {
  const {carrier, ...rest} = mockResolvedDeliveryOption(option);

  return {
    carrier: carrier.identifier,
    ...rest,
  };
};
