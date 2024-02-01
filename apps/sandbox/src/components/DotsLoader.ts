import {h, type FunctionalComponent} from 'vue';

const renderDot = (n: number) => {
  const animationDelayClass = n === 2 ? 'mp-animate-delay-75' : n === 3 ? 'mp-animate-delay-150' : '';
  const baseClasses = [
    'mp-animate-pulse',
    'mp-bg-goldfish-500',
    'mp-bg-opacity-30',
    'mp-h-4',
    'mp-rounded-full',
    'mp-w-4',
  ];

  return h(
    'div',
    {
      key: n,
      class: ['mp-animate-bounce', animationDelayClass],
    },
    h('div', {
      class: [...baseClasses, animationDelayClass],
    }),
  );
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const DotsLoader: FunctionalComponent = () => {
  return h('div', {class: 'mp-flex mp-gap-2'}, Array.from({length: 3}, (_, i) => i + 1).map(renderDot));
};
