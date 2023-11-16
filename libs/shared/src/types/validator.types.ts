import {type ComponentOrHtmlElement, type ElementName, type Validator} from '@myparcel/vue-form-builder';

export type CustomValidator<T = never> = Validator<ComponentOrHtmlElement, ElementName, T>;
