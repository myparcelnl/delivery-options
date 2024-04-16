interface BaseTranslatable {
  key: string;
}

export interface Untranslatable extends BaseTranslatable {
  plain: true;
}

export interface Translatable extends BaseTranslatable {
  plain?: false;
}

export interface TranslatableWithArgs extends Translatable {
  args: Record<string, AnyTranslatable>;
}

export type AnyTranslatable = string | Translatable | TranslatableWithArgs | Untranslatable;
