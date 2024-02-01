import {useLanguage} from '../composables';

export const translateCountry = (country: string): string => {
  const {translate} = useLanguage();

  return translate(`country_${country.toLowerCase()}`);
};
