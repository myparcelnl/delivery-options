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
    props.fluid ? 'mp-max-w-full' : 'mp-max-w-screen-2xl',
    props.flowCol ? 'mp-grid-flow-col' : 'mp-grid-flow-row',
  ];

  return h(
    'div',
    {
      class: ['mp-mx-auto', 'mp-w-[98%]', ...classes],
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
