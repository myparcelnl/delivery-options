import {type Component, h} from 'vue';

interface Props {
  columns?: number;
}

export const Container: Component<Props> = (props, ctx) => {
  const additionalClasses = [];

  if (props.columns) {
    additionalClasses.push('grid', 'gap-4', 'grid-flow-col');

    switch (props.columns) {
      case 2:
        additionalClasses.push('grid-cols-2');
        break;
    }
  }

  return h(
    'div',
    {
      class: ['mt-4 mb-3 px-4 py-4 bg-white border border-gray-300 rounded-lg shadow-sm', ...additionalClasses],
    },
    ctx.slots,
  );
};
