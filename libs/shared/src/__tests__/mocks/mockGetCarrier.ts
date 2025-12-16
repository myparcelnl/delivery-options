import {vi} from 'vitest';
import {type Carrier, type GetCarrier} from '@myparcel-dev/sdk';
import {type SdkMock} from '../types';
import {fakeCarriersResponse} from './fakeCarriersResponse';

export const mockGetCarrier = vi.fn((endpoint, options) => {
  return fakeCarriersResponse(options.path?.carrier) as [Carrier];
}) satisfies SdkMock<GetCarrier>;
