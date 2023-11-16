import {vi} from 'vitest';
import {MockFetchClient} from './mocks/MockFetchClient';

vi.doMock('@myparcel/sdk', async () => {
  const actual = await vi.importActual('@myparcel/sdk');

  return {
    // @ts-expect-error todo
    ...actual,
    FetchClient: MockFetchClient,
  };
});
