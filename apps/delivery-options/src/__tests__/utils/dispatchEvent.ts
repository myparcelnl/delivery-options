import {flushPromises} from '@vue/test-utils';

export const dispatchEvent = async (event: string, detail?: unknown): Promise<void> => {
  const eventInstance = detail ? new CustomEvent(event, {detail}) : new Event(event);

  document.dispatchEvent(eventInstance);

  await flushPromises();
};
