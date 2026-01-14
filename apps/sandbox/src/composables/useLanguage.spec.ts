import {nextTick} from 'vue';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';

/**
 * @vitest-environment happy-dom
 */

describe('useLanguage', () => {
  const fetchSpy = vi.fn(async (url) => {
    const mockTranslations = {
      fr: {
        mailbox: 'Boîte aux lettres',
        string_addressField: 'Adresse',
        string_addressField_description: 'Adresse description',
      },
      en: {
        mailbox: 'Mailbox',
        string_addressField: 'Address',
        string_addressField_description: 'Address description',
      },
    };

    return {
      ok: true,
      json: async () => {
        const language = url.split('/').pop()?.split('.').shift() ?? 'en';

        return mockTranslations[language as keyof typeof mockTranslations];
      },
    };
  });

  beforeEach(() => {
    setActivePinia(createPinia());

    global.fetch = fetchSpy as any;

    // change the language to FR
    Object.defineProperty(global.navigator, 'languages', {
      value: ['es', 'fr-BE', 'fr', 'en'],
      configurable: true,
    });
  });

  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    fetchSpy.mockClear();
  });

  it('loads the first supported language, ordered by preference', async () => {
    expect.assertions(1);

    const {useLanguage} = await import('./useLanguage');
    await nextTick();

    const {language} = useLanguage();

    expect(language.value.code).toBe('fr');
  });

  it('loads new translations on language switch', async ({expect}) => {
    expect.assertions(5);
    const {useLanguage} = await import('./useLanguage');

    const {setLanguage} = useLanguage();
    await nextTick();

    await setLanguage('nl');
    expect(fetchSpy).toHaveBeenNthCalledWith(3, '/translations/nl.json');
    expect(fetchSpy).toHaveBeenNthCalledWith(4, '/translations/delivery-options/nl.json');

    await setLanguage('fr');
    // should not fetch again because it's already loaded
    expect(fetchSpy).toHaveBeenCalledTimes(4);

    await setLanguage('en');
    expect(fetchSpy).toHaveBeenNthCalledWith(5, '/translations/en.json');
    expect(fetchSpy).toHaveBeenNthCalledWith(6, '/translations/delivery-options/en.json');
  });

  it('returns the correct translation', async () => {
    expect.assertions(2);
    const {useLanguage} = await import('./useLanguage');

    const {translate, setLanguage} = useLanguage();

    await setLanguage('en');
    expect(translate('mailbox')).toBe('Mailbox');

    await setLanguage('fr');
    expect(translate('mailbox')).toBe('Boîte aux lettres');
  });

  it.skip('returns an object with all strings', async () => {
    expect.assertions(2);
    const {useLanguage} = await import('./useLanguage');

    const {strings, setLanguage} = useLanguage();

    await setLanguage('en');
    expect(strings.value).toEqual({
      addressField: 'Address',
    });

    await setLanguage('fr');
    expect(strings.value).toEqual({
      addressField: 'Adresse',
    });
  });
});
