import {type FunctionalComponent, h} from 'vue';
import {gridClasses} from '../constants';

interface ContainerProps {
  flowCol?: boolean;
  fluid?: boolean;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Container: FunctionalComponent<ContainerProps> = (props, ctx) => {
  const classes = [
    ...gridClasses,
    props.fluid ? 'max-w-full' : 'max-w-screen-2xl',
    props.flowCol ? 'grid-flow-col' : 'grid-flow-row',
  ];

  return h(
    'div',
    {
      class: ['mx-auto', 'w-[98%]', ...classes],
    },
    ctx.slots,
  );
};

Container.props = {
  flowCol: {
    type: Boolean,
    default: false,
  },
  fluid: {
    type: Boolean,
    default: false,
  },
};
