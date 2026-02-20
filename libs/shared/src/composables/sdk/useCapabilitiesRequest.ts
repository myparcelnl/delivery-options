import {type CapabilitiesRequest, type CapabilitiesResponse, type RequestHandler} from '../../types';
import {useRequest} from './useRequest';

const REQUEST_KEY_CAPABILITIES = 'capabilities';
const CAPABILITIES_BEARER_TOKEN = 'fore-testing-purposes-only-already-rotated';

export const useCapabilitiesRequest = (
  apiBaseUrl: string,
  request: CapabilitiesRequest,
): RequestHandler<CapabilitiesResponse> => {
  return useRequest(
    [REQUEST_KEY_CAPABILITIES, request],
    async () => {
      const response = await fetch(`${apiBaseUrl}/shipments/capabilities`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CAPABILITIES_BEARER_TOKEN}`,
          Accept: 'application/json;charset=utf-8;version=2.0',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Capabilities request failed: ${response.status}`);
      }

      return response.json();
    },
    {
      fallback: {results: []} as CapabilitiesResponse,
    },
  );
};
