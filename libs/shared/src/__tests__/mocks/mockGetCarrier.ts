import {vi} from 'vitest';
import {type Carrier, type GetCarrier} from '@myparcel/sdk';
import {type SdkMock} from '../mocks';
import {fakeCarriersResponse} from './fakeCarriersResponse';

export const mockGetCarrier = vi.fn((endpoint, options) => {
  return fakeCarriersResponse(options.path?.carrier) as [Carrier];
}) satisfies SdkMock<GetCarrier>;
