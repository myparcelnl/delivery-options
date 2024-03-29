import {type FunctionalComponent, h} from 'vue';
import {gridClasses} from '../constants';

interface Props {
  columns?: number | string;
  is?: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Box: FunctionalComponent<Props> = (props, ctx) => {
  const additionalClasses = [];

  if (props.columns) {
    additionalClasses.push(...gridClasses);

    switch (Number(props.columns)) {
      case 2:
        additionalClasses.push('mp-grid-cols-2');
        break;
    }
  }

  return h(
    props.is ?? 'div',
    {
      class: ['mp-px-4', 'mp-py-4', 'mp-border', 'mp-rounded-xl', 'mp-shadow-sm', ...additionalClasses],
    },
    ctx.slots,
  );
};

Box.props = {
  is: {
    type: String,
  },
  columns: {
    type: [Number, String],
  },
};
