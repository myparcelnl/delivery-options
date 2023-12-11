import {vi} from 'vitest';
import {type GetCarriers} from '@myparcel/sdk';
import {type SdkMock} from '../types';
import {fakeCarriersResponse} from '../../../../../apps/delivery-options/src/__tests__/mocks/fakeCarriersResponse';

export const mockGetCarriers = vi.fn((endpoint, options) => {
  return fakeCarriersResponse();
}) satisfies SdkMock<GetCarriers>;
