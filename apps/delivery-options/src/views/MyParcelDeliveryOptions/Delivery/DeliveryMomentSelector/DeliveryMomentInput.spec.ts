import {type Ref, defineComponent, h, ref} from 'vue';
import {describe, it, expect, beforeEach} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {flushPromises} from '@vue/test-utils';
import {render} from '@testing-library/vue';
import {CustomEvent} from 'happy-dom';
import {
  type SelectOption,
  KEY_CONFIG,
  KEY_CARRIER_SETTINGS,
  CarrierSetting,
  createUntranslatable,
} from '@myparcel-dev/do-shared';
import {CarrierName, DeliveryTypeName, PackageTypeName} from '@myparcel-dev/constants';
import {useLanguage, useSelectedValues, useDeliveryOptionsIncomingEvents} from '../../../../composables';
import {mockDeliveryOptionsConfig, getMockDeliveryOptionsConfiguration} from '../../../../__tests__';
import {UNSELECT_DELIVERY_OPTIONS} from '../../../../data';
import DeliveryMomentInput from './DeliveryMomentInput.vue';

const makeOption = (
  carrier: CarrierName,
  deliveryType: DeliveryTypeName = DeliveryTypeName.Standard,
): SelectOption<string> => ({
  carrier,
  label: createUntranslatable(deliveryType),
  price: 0,
  value: JSON.stringify({
    carrier,
    date: null,
    deliveryType,
    packageType: PackageTypeName.Package,
    shipmentOptions: [],
    time: null,
  }),
});

const POSTNL = makeOption(CarrierName.PostNl);
const DHL = makeOption(CarrierName.DhlForYou);

/**
 * Render DeliveryMomentInput with its v-model bound to the shared `deliveryMoment`, exactly as the
 * real parent (DeliveryMomentSelector.vue) does. This lets the tests drive/observe the selection
 * through the shared state the auto-select watch reads and writes.
 */
const renderInput = (optionsRef: Ref<SelectOption<string>[]>) => {
  const {deliveryMoment} = useSelectedValues();

  const Wrapper = defineComponent({
    setup() {
      return () =>
        h(DeliveryMomentInput, {
          options: optionsRef.value,
          modelValue: deliveryMoment.value,
          'onUpdate:modelValue': (value: string | undefined) => {
            deliveryMoment.value = value;
          },
        });
    },
  });

  return render(Wrapper);
};

describe('DeliveryMomentInput.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    const {deliveryMoment, carrier} = useSelectedValues();
    deliveryMoment.value = undefined;
    carrier.value = undefined;

    useLanguage().setStrings({});

    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [KEY_CARRIER_SETTINGS]: {
            [CarrierName.PostNl]: {[CarrierSetting.AllowStandardDelivery]: true},
            [CarrierName.DhlForYou]: {[CarrierSetting.AllowStandardDelivery]: true},
          },
        },
      }),
    );
  });

  it('selects the first standard option by default when nothing is selected', async () => {
    const {deliveryMoment} = useSelectedValues();

    renderInput(ref([POSTNL, DHL]));
    await flushPromises();

    expect(deliveryMoment.value).toBe(POSTNL.value);
  });

  it('preserves a still-valid selection instead of overwriting it with the default', async () => {
    const {deliveryMoment} = useSelectedValues();
    deliveryMoment.value = DHL.value;

    renderInput(ref([POSTNL, DHL]));
    await flushPromises();

    expect(deliveryMoment.value).toBe(DHL.value);
  });

  it('replaces a stale selection that is no longer present in the options with the default', async () => {
    const {deliveryMoment} = useSelectedValues();
    deliveryMoment.value = 'stale-value';

    renderInput(ref([POSTNL, DHL]));
    await flushPromises();

    expect(deliveryMoment.value).toBe(POSTNL.value);
  });

  it('keeps the selection cleared after the host fires UNSELECT_DELIVERY_OPTIONS', async () => {
    const {deliveryMoment} = useSelectedValues();

    // Register the real unselect handler, exactly as the app does on boot. It calls
    // clearSelectedValues() in response to the host's UNSELECT_DELIVERY_OPTIONS event.
    useDeliveryOptionsIncomingEvents();

    renderInput(ref([POSTNL, DHL]));
    await flushPromises();
    expect(deliveryMoment.value).toBe(POSTNL.value);

    // The host explicitly clears the selection. It must stay cleared.
    document.dispatchEvent(new CustomEvent(UNSELECT_DELIVERY_OPTIONS));
    await flushPromises();

    expect(deliveryMoment.value).toBeUndefined();
  });

  it('leaves the selection untouched when there are no options', async () => {
    const {deliveryMoment} = useSelectedValues();
    deliveryMoment.value = 'stale-value';

    renderInput(ref([]));
    await flushPromises();

    expect(deliveryMoment.value).toBe('stale-value');
  });
});
