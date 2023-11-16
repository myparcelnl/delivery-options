interface UseLanguage {
  translate(key: string): string;
}

export const useLanguage = (): UseLanguage => {
  return {
    translate(key: string): string {
      return key;
    },
  };
};
