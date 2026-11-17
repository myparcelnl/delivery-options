import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {render} from '@testing-library/vue';
import {consoleErrorSpy} from '@myparcel-dev/do-shared/testing';
import {
  ConfigSetting,
  type InputDeliveryOptionsConfig,
  type InputDeliveryOptionsConfiguration,
  KEY_CONFIG,
  KEY_STRINGS,
} from '@myparcel-dev/do-shared';
import {useConfigStore} from '../../../stores';
import {setConfiguration} from '../../../config';
import PriceTag from './PriceTag.vue';

const PRICE = 4;
const FREE = 'Gratis';

const formatWithIntl = (locale: string, currency: string): string =>
  new Intl.NumberFormat(locale, {style: 'currency', currency}).format(PRICE);

const renderWithConfig = (config: InputDeliveryOptionsConfig, price = PRICE): string | null => {
  // The price does not depend on the address, so the input leaves it out.
  setConfiguration({[KEY_CONFIG]: config, [KEY_STRINGS]: {free: FREE}} as InputDeliveryOptionsConfiguration);

  return render(PriceTag, {props: {price}}).container.textContent;
};

describe('PriceTag', () => {
  beforeEach(() => {
    useConfigStore().reset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the price in the configured currency and locale', () => {
    expect(renderWithConfig({[ConfigSetting.Currency]: 'DKK', [ConfigSetting.Locale]: 'da-DK'})).toBe(
      formatWithIntl('da-DK', 'DKK'),
    );
  });

  it('renders the price in euro when no currency is configured', () => {
    expect(renderWithConfig({[ConfigSetting.Locale]: 'nl-NL'})).toBe(formatWithIntl('nl-NL', 'EUR'));
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('renders the price in the browser language when no locale is configured', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-GB');

    expect(renderWithConfig({[ConfigSetting.Currency]: 'EUR'})).toBe('€4.00');
  });

  it.each(['D1', 'ABC', ''])('renders the price in euro and logs the value once for currency "%s"', (currency) => {
    expect(renderWithConfig({[ConfigSetting.Currency]: currency, [ConfigSetting.Locale]: 'nl-NL'})).toBe(
      formatWithIntl('nl-NL', 'EUR'),
    );
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      `❌ [${ConfigSetting.Currency}]`,
      expect.any(String),
      expect.objectContaining({value: currency}),
    );
  });

  it.each(['pt-PT-ao90', 'nl_NL', '', 123])(
    'renders the price in the browser language and logs the value once for locale "%s"',
    (locale) => {
      vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-GB');

      // The number tests a value of the wrong type on purpose.
      expect(renderWithConfig({[ConfigSetting.Currency]: 'EUR', [ConfigSetting.Locale]: locale as string})).toBe(
        '€4.00',
      );
      expect(consoleErrorSpy).toHaveBeenCalledOnce();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        `❌ [${ConfigSetting.Locale}]`,
        expect.any(String),
        expect.objectContaining({value: locale}),
      );
    },
  );

  it('renders nothing for a price of 0', () => {
    expect(renderWithConfig({[ConfigSetting.ShowPriceZeroAsFree]: false}, 0)).toBe('');
  });

  it('renders the free text for a price of 0 when showPriceZeroAsFree is on', () => {
    expect(renderWithConfig({[ConfigSetting.ShowPriceZeroAsFree]: true}, 0)).toBe(FREE);
  });
});
