/**
 * Sent by configBus when a setting is updated.
 */
export const UPDATE = 'update';

/**
 * Sent by configBus after a setting is updated (by `UPDATE`).
 */
export const AFTER_UPDATE = 'after_update';

/**
 * Sent by configBus when an error has occurred.
 */
export const ERROR = 'error';

/**
 * This event is used to change the config after the initialization.
 */
export const UPDATE_CONFIG_IN = 'myparcel_update_config';

/**
 * For the external platform to tell this application to update. If it's a CustomEvent the detail will be used as the
 *  address.
 */
export const UPDATE_DELIVERY_OPTIONS = 'myparcel_update_delivery_options';

/**
 * To tell the external platform the address is updated.
 */
export const UPDATED_ADDRESS = 'myparcel_updated_address';

/**
 * To tell the external platform it needs to update.
 */
export const UPDATED_DELIVERY_OPTIONS = 'myparcel_updated_delivery_options';

/**
 * Disable the delivery options.
 */
export const DISABLE_DELIVERY_OPTIONS = 'myparcel_disable_delivery_options';

/**
 * Manually show the delivery options.
 */
export const SHOW_DELIVERY_OPTIONS = 'myparcel_show_delivery_options';

/**
 * Manually hide the delivery options.
 */
export const HIDE_DELIVERY_OPTIONS = 'myparcel_hide_delivery_options';

/**
 * Used to (re)render the entire module.
 */
export const RENDER_DELIVERY_OPTIONS = 'myparcel_render_delivery_options';
