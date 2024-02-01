/* eslint-disable @typescript-eslint/naming-convention */
import {type FunctionalComponent, h} from 'vue';
import {NBSP} from '../data';

const COMMON_GRID_CLASSES = ['mp-flex', 'mp-flex-1'];

export const LOADER_CLASSES = ['mp-bg-black', 'dark:mp-bg-white', 'mp-opacity-25'];

const Wrapper: FunctionalComponent = (_, ctx) => {
  return h('div', {class: [...COMMON_GRID_CLASSES, 'mp-animate-pulse']}, ctx.slots);
};

const Base: FunctionalComponent = (_, ctx) => {
  return h('div', {class: LOADER_CLASSES}, ctx.slots);
};

const Text: FunctionalComponent = () => {
  return h(Base, {class: ['mp-rounded-full', 'mp-text-transparent']}, () => [NBSP]);
};

const Circle: FunctionalComponent = () => {
  return h(Base, {class: ['mp-rounded-full']});
};

interface ContainerProps {
  col?: boolean;
}

const Container: FunctionalComponent<ContainerProps> = (props, ctx) => {
  return h(
    'div',
    {
      class: [...COMMON_GRID_CLASSES, 'mp-flex-wrap', props.col ? 'mp-flex-col' : 'mp-flex-row'],
    },
    ctx.slots,
  );
};

export const Loader = {
  Base,
  Circle,
  Text,
  Wrapper,
  Container,
};
