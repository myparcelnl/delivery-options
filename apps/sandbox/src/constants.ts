import {type LanguageDefinition} from './types';

const DEFAULT_API_BASE_URL = 'https://api.myparcel.nl';

export const getProxyCapabilitiesUrl = (apiBaseUrl?: string): string =>
  `${apiBaseUrl ?? DEFAULT_API_BASE_URL}/shipments/capabilities`;

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
