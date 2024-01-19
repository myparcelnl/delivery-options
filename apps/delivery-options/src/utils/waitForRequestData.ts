import {get, isDefined} from '@vueuse/core';
import {type RequestHandler} from '@myparcel-do/shared';

export const waitForRequestData = async <Response, Args extends unknown[]>(
  endpoint: (...args: Args) => RequestHandler<Response>,
  args: Args,
): Promise<Response> => {
  const request = endpoint(...args);
  await request.load();

  const data = get(request.data);

  if (!isDefined(data)) {
    throw new Error();
  }

  return data as Response;
};
