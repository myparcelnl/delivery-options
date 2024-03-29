export const waitForEvent = <Res = unknown>(
  eventName: string,
  subject: HTMLElement | Document = document,
): Promise<Res> => {
  return new Promise((resolve) => {
    const listener = (e: Event | CustomEvent<Res>) => {
      subject.removeEventListener(eventName, listener);
      resolve(e instanceof CustomEvent ? e.detail : undefined);
    };

    subject.addEventListener(eventName, listener);
  });
};
