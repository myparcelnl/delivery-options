import {describe, it, expect, beforeEach} from 'vitest';
import {createPinia} from 'pinia';
import {flushPromises} from '@vue/test-utils';
import {render, fireEvent} from '@testing-library/vue';
import {KEY_CONFIG, KEY_CARRIER_SETTINGS, ConfigSetting, CarrierSetting} from '@myparcel-dev/do-shared';
import {CarrierName} from '@myparcel-dev/constants';
import MyParcelDeliveryOptions from '../MyParcelDeliveryOptions.vue';
import {useSelectedValues} from '../../../composables';
import {getMockDeliveryOptionsConfiguration} from '../../../__tests__';

/**
 * Render the full MyParcelDeliveryOptions component with the given configuration,
 * then set carrier to PostNl so the render-switch shows DeliveryOptionsForm.
 */
const renderForm = async (configuration: ReturnType<typeof getMockDeliveryOptionsConfiguration>) => {
  const result = render(MyParcelDeliveryOptions, {
    global: {plugins: [createPinia()]},
    props: {configuration},
  });

  // Wait for CompactCarrierList (or initial render) to settle
  await flushPromises();

  // Set carrier so MyParcelDeliveryOptions shows DeliveryOptionsForm (not CompactCarrierList)
  const {carrier} = useSelectedValues();
  carrier.value = CarrierName.PostNl;
  await flushPromises();

  return result;
};

describe('DeliveryOptionsForm.vue — terug-knop', () => {
  beforeEach(() => {
    // Reset carrier so each test starts fresh
    const {carrier, deliveryDate} = useSelectedValues();
    carrier.value = undefined;
    deliveryDate.value = undefined;
  });

  const makeConfig = (compactView: boolean) =>
    getMockDeliveryOptionsConfiguration({
      [KEY_CONFIG]: {
        [ConfigSetting.CompactView]: compactView,
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowDeliveryOptions]: true,
            [CarrierSetting.AllowStandardDelivery]: true,
          },
        },
      },
    });

  it('does not render the back button when compactView=false', async () => {
    const config = makeConfig(false);
    const {queryByTestId} = await renderForm(config);

    expect(queryByTestId('compact-back-button')).toBeNull();
  });

  it('renders the back button when compactView=true', async () => {
    const config = makeConfig(true);
    const {findByTestId} = await renderForm(config);

    expect(await findByTestId('compact-back-button')).toBeTruthy();
  });

  it('clicking the back button fully resets carrier and deliveryDate', async () => {
    const config = makeConfig(true);
    const {findByTestId} = await renderForm(config);

    const {carrier, deliveryDate} = useSelectedValues();
    deliveryDate.value = '2026-05-08';
    // carrier is already set to PostNl by renderForm

    const button = await findByTestId('compact-back-button');
    await fireEvent.click(button);
    await flushPromises();

    expect(carrier.value).toBeUndefined();
    expect(deliveryDate.value).toBeUndefined();
  });
});
