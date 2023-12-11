import {vi} from 'vitest';
import {type SdkMock} from '@myparcel-do/shared/testing';
import {type GetPickupLocations} from '@myparcel/sdk';
import {fakePickupLocationsResponse} from './fakePickupLocationsResponse';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const mockGetPickupLocations = vi.fn((endpoint, options) => {
  return fakePickupLocationsResponse();
}) satisfies SdkMock<GetPickupLocations>;
