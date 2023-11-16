import {type Mock} from 'vitest';
import {type AbstractEndpoint, type EndpointParameters, type EndpointPath, type EndpointResponse} from '@myparcel/sdk';

export type SdkMock<E extends AbstractEndpoint> = Mock<
  [
    E,
    {
      parameters: EndpointParameters<E>;
      path: EndpointPath<E>;
    },
  ],
  EndpointResponse<E>
>;
