export const TYPE_BOOLEAN = 'boolean';

export const TYPE_OBJECT = 'object';

export const TYPE_STRING = 'string';

const VALUE_MUST = 'Value must';

export const createValueMustBe = (type: string): string => `${VALUE_MUST} be ${type}`;

export const createValueMustBeA = (type: string): string => createValueMustBe(`a ${type}`);

export const createValueMustHave = (text: string): string => `${VALUE_MUST} have ${text}`;
