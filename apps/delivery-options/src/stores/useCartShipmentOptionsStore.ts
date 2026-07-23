import {type DeliveryOptionsStore} from '.';
import {reactive} from 'vue';
import {type CartShipmentOptions} from '@myparcel-dev/do-shared';

const state = reactive<CartShipmentOptions>({});

/**
 * Remove every carrier entry from the state, keeping the same reactive object.
 */
function reset(): void {
  for (const key of Object.keys(state)) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (state as Record<string, unknown>)[key];
  }
}

/**
 * Replace the stored cart shipment options with the given map.
 *
 * @param cartShipmentOptions - The full carrier → option name → on/off map, as validated from the configuration input.
 */
function update(cartShipmentOptions: CartShipmentOptions): void {
  reset();
  Object.assign(state, cartShipmentOptions);
}

/**
 * Holds the shipment options the cart currently ships with, per carrier, as calculated by
 * the plugin. Read by useShipmentOptionsState to decide which options must be shown as
 * checked and locked. Empty when the plugin did not send cartShipmentOptions.
 */
export const useCartShipmentOptionsStore = (): DeliveryOptionsStore<CartShipmentOptions> => {
  return {
    state,
    update,
    reset,
  };
};
