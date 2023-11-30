/* eslint-disable @typescript-eslint/naming-convention */
import {type FunctionalComponent, h} from 'vue';

const COMMON_GRID_CLASSES = ['mp-flex', 'mp-flex-1'];

const Wrapper: FunctionalComponent = (_, ctx) =>
  h('div', {class: [...COMMON_GRID_CLASSES, 'mp-animate-pulse']}, ctx.slots);

const Base: FunctionalComponent = (_, ctx) =>
  h('div', {class: ['mp-bg-black', 'dark:mp-bg-white', 'mp-opacity-25']}, ctx.slots);

const Text: FunctionalComponent = () => h(Base, {class: ['mp-rounded-full', 'mp-text-transparent']}, () => ['&nbsp;']);

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
