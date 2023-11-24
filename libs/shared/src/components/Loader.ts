import {type FunctionalComponent, h} from 'vue';

const COMMON_GRID_CLASSES = ['mp-flex', 'mp-gap-2', 'mp-flex-1'];

const Wrapper: FunctionalComponent = (_, ctx) =>
  h('div', {class: [...COMMON_GRID_CLASSES, 'mp-animate-pulse']}, ctx.slots);

const Base: FunctionalComponent = () => h('div', {class: ['mp-bg-black', 'dark:mp-bg-white', 'mp-opacity-25']});

const Text: FunctionalComponent = () => h(Base, {class: ['mp-h-3', 'mp-rounded-full']});

const Circle: FunctionalComponent = () => h(Base, {class: ['mp-rounded-full']});

interface ContainerProps {
  col?: boolean;
}

const Container: FunctionalComponent<ContainerProps> = (props, ctx) =>
  h('div', {class: [...COMMON_GRID_CLASSES, 'mp-flex-wrap', props.col ? 'mp-flex-col' : 'mp-flex-row']}, ctx.slots);

export const Loader = {
  Base,
  Circle,
  Text,
  Wrapper,
  Container,
};
