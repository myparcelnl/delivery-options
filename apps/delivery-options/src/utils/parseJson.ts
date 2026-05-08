export const parseJson = <T = unknown>(text: string | undefined): T => JSON.parse(text ?? '{}');
