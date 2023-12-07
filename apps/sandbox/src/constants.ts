import {type LanguageDefinition} from './types';

export const gridClasses = ['mp-grid', 'mp-gap-4'];

export enum StyleVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Light = 'light',
  Dark = 'dark',
}

export enum StyleSize {
  Small = 'sm',
  Medium = 'md',
  Large = 'lg',
}

export const AVAILABLE_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    emoji: '🇬🇧',
  },
  {
    code: 'nl',
    name: 'Nederlands',
    emoji: '🇳🇱',
  },
  {
    code: 'fr',
    name: 'Français',
    emoji: '🇫🇷',
  },
  {
    code: 'de',
    name: 'Deutsch',
    emoji: '🇩🇪',
  },
] as const satisfies LanguageDefinition[];
