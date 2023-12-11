import {vi} from 'vitest';
import {type SdkMock} from '@myparcel-do/shared/testing';
import {type GetDeliveryOptions} from '@myparcel/sdk';
import {fakeDeliveryOptionsResponse} from './fakeDeliveryOptionsResponse';

export const mockGetDeliveryOptions = vi.fn((endpoint, options) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return fakeDeliveryOptionsResponse(options.parameters!);
}) satisfies SdkMock<GetDeliveryOptions>;
