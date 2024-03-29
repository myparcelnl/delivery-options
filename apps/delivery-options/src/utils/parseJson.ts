export const parseJson = <T extends unknown>(text: string | undefined): T => JSON.parse(text || '{}');
