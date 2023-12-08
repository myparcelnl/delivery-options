import {vi} from 'vitest';
import {type GetDeliveryOptions} from '@myparcel/sdk';
import {type SdkMock} from '../types';
import {fakeDeliveryOptionsResponse} from './fakeDeliveryOptionsResponse';

export const mockGetDeliveryOptions = vi.fn((endpoint, options) => {
  return fakeDeliveryOptionsResponse(options.parameters!);
}) satisfies SdkMock<GetDeliveryOptions>;
