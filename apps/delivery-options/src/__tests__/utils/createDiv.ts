export const createDiv = (id?: string): HTMLDivElement => {
  const wrapper = document.createElement('div');
  wrapper.id = id ?? __CLASS_BASE__;

  document.body.appendChild(wrapper);

  return wrapper;
};
