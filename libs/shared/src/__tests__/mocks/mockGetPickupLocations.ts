import {vi} from 'vitest';
import {type GetPickupLocations} from '@myparcel-dev/sdk';
import {type SdkMock} from '../types';
import {fakePickupLocationsResponse} from './fakePickupLocationsResponse';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const mockGetPickupLocations = vi.fn((endpoint, options) => {
  return fakePickupLocationsResponse();
}) satisfies SdkMock<GetPickupLocations>;
