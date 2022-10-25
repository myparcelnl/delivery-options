/**
 * ConfigBus events.
 *
 * These are only used for and by the configBus so they don't need to be namespaced.
 */

/**
 * Sent by configBus when a setting is updated.
 *
 * @type {string}
 */
export const UPDATE = 'update';

/**
 * Sent by configBus after a setting is updated (by `UPDATE`).
 *
 * @type {string}
 */
export const AFTER_UPDATE = 'after_update';

/**
 * Sent by configBus when an error has occurred.
 *
 * @type {string}
 */
export const ERROR = 'error';

/*
 * Document events
 * The following events should be namespaced to avoid any possible conflicts.
 */

/**
 * This event is used to change the config after the initialization.
 *
 * @type {string}
 */
export const UPDATE_CONFIG_IN = 'myparcel_update_config';

/**
 * For the external platform to tell this application to update. If it's a CustomEvent the detail will be used as the
 *  address.
 *
 * @type {string}
 */
export const UPDATE_DELIVERY_OPTIONS = 'myparcel_update_delivery_options';

/**
 * To tell the external platform the address is updated.
 *
 * @type {string}
 */
export const UPDATED_ADDRESS = 'myparcel_updated_address';

/**
 * To tell the external platform it needs to update.
 *
 * @type {string}
 */
export const UPDATED_DELIVERY_OPTIONS = 'myparcel_updated_delivery_options';

/**
 * Disable the delivery options.
 *
 * @type {string}
 */
export const DISABLE_DELIVERY_OPTIONS = 'myparcel_disable_delivery_options';

/**
 * Manually show the delivery options. The update listener has to be re-enabled after this.
 *
 * @type {string}
 */
export const SHOW_DELIVERY_OPTIONS = 'myparcel_show_delivery_options';

/**
 * Manually hide the delivery options. Should remove the update listener.
 *
 * @type {string}
 */
export const HIDE_DELIVERY_OPTIONS = 'myparcel_hide_delivery_options';

/**
 * Used to (re)render the entire module.
 *
 * @type {string}
 */
export const RENDER_DELIVERY_OPTIONS = 'myparcel_render_delivery_options';

export const EVENT_CONFIG = {
  UPDATE,
  AFTER_UPDATE,
  ERROR,
  UPDATE_CONFIG_IN,
  UPDATE_DELIVERY_OPTIONS,
  UPDATED_ADDRESS,
  UPDATED_DELIVERY_OPTIONS,
  DISABLE_DELIVERY_OPTIONS,
  SHOW_DELIVERY_OPTIONS,
  HIDE_DELIVERY_OPTIONS,
  RENDER_DELIVERY_OPTIONS,
};
