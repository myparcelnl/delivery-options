import {vi} from 'vitest';
import {type GetCarriers} from '@myparcel-dev/sdk';
import {type SdkMock} from '../types';
import {fakeCarriersResponse} from './fakeCarriersResponse';

export const mockGetCarriers = vi.fn((endpoint, options) => {
  return fakeCarriersResponse();
}) satisfies SdkMock<GetCarriers>;
