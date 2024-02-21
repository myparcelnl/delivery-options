import {type Translatable} from '@myparcel-do/shared';

export const createTranslatable = (string: string): Translatable => ({key: string});
