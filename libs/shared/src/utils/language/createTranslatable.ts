import {type Translatable} from '../../types';

export const createTranslatable = (string: string): Translatable => ({key: string});
