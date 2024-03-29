interface BaseTranslatable {
  key: string;
}

export interface Untranslatable extends BaseTranslatable {
  plain: true;
}

export interface Translatable extends BaseTranslatable {
  plain?: false;
}

export type AnyTranslatable = string | Translatable | Untranslatable;
