import {type Mock} from 'vitest';
import {type AbstractEndpoint, type EndpointResponse, type Options} from '@myparcel/sdk';

export type SdkMock<E extends AbstractEndpoint> = Mock<[E, Options<E>], EndpointResponse<E>>;
