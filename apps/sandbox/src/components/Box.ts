import {type FunctionalComponent, h} from 'vue';
import {gridClasses} from '../constants';

interface Props {
  columns?: number | string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Box: FunctionalComponent<Props> = (props, ctx) => {
  const additionalClasses = [];

  if (props.columns) {
    additionalClasses.push(...gridClasses);

    switch (Number(props.columns)) {
      case 2:
        additionalClasses.push('grid-cols-[1fr,1fr]');
        break;
    }
  }

  return h(
    'div',
    {
      class: ['mt-4', 'mb-3', 'px-4', 'py-4', 'border', 'rounded-lg', 'shadow-sm', ...additionalClasses],
    },
    ctx.slots,
  );
};

Box.props = {
  columns: {
    type: [Number, String],
  },
};
