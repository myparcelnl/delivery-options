import {vi} from 'vitest';
import {type GetCarriers} from '@myparcel-dev/sdk';
import {type SdkMock} from '../types';
import {fakeCarriersResponse} from './fakeCarriersResponse';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const mockGetCarriers = vi.fn((endpoint, options) => {
  return fakeCarriersResponse();
}) satisfies SdkMock<GetCarriers>;
