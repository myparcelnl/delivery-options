export const waitForEvent = <Res = unknown>(
  eventName: string,
  subject: HTMLElement | Document = document,
): Promise<Res> => {
  return new Promise((resolve) => {
    const listener = (event: Event | CustomEvent<Res>) => {
      subject.removeEventListener(eventName, listener);
      resolve(event instanceof CustomEvent ? event.detail : undefined);
    };

    subject.addEventListener(eventName, listener);
  });
};
