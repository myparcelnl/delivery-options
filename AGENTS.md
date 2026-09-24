# MyParcel Delivery Options

A Vue 3 widget for e-commerce checkouts. The consumer uses it to pick a delivery or pickup option. The widget does not hardcode carriers or options: it fetches them at runtime as capabilities from a `proxyCapabilities` URL that the integrating platform supplies.

Used by: the PDK plugins (through js-pdk), MyParcel integrations without the PDK such as Magento and Ecwid, and third parties who integrate it directly by following the [developer portal guide](https://developer.myparcel.com/platforms/delivery-options.html).

## MyParcel stack

This repository is one part of the MyParcel plugin stack:

| Repository | Role |
| --- | --- |
| [myparcelnl/sdk](https://github.com/myparcelnl/sdk) | PHP client generated from the MyParcel API OpenAPI spec. Source of carriers, delivery types, package types and API types. |
| [myparcelnl/pdk](https://github.com/myparcelnl/pdk) | PHP Plugin Development Kit. Business logic, models, settings, migrations and API calls shared by all plugins. |
| [myparcelnl/js-pdk](https://github.com/myparcelnl/js-pdk) | JS Plugin Development Kit. Admin UI and checkout scripts that the plugins build on. |
| [myparcelnl/delivery-options](https://github.com/myparcelnl/delivery-options) **(this repository)** | Checkout widget in which the consumer picks a delivery or pickup option. |
| [myparcelnl/woocommerce](https://github.com/myparcelnl/woocommerce) | WooCommerce plugin. Thin adapter on top of the PDK. |
| [myparcelnl/prestashop](https://github.com/myparcelnl/prestashop) | PrestaShop module. Thin adapter on top of the PDK. |

How they connect:

- A plugin bootstraps the PDK and implements the platform adapters (storage, hooks, rendering, cron). Behaviour that all plugins share goes in the PDK, not in one plugin.
- The PDK renders its context as JSON in an HTML attribute (`data-pdk-context` for the admin). The js-pdk apps read it and call PDK endpoint actions (registered in the PDK's `config/actions.php`) for more data.
- The delivery options widget is not bundled into the plugins. The PDK builds jsdelivr CDN URLs for `myparcel.js`, `myparcel.lib.js` and `style.css` (the PDK's `config/pdk-dependencies.php`), and the plugin loads them at runtime. In js-pdk, the `@myparcel-dev/delivery-options` npm dependency supplies only types and constants.
- The widget and the js-pdk admin get carrier capabilities by POSTing to the PDK `proxyCapabilities` action (`PdkCapabilitiesActions`).
- Carriers, delivery types and package types come from the SDK. Do not add definitions of them to the PDK or the plugins.

For local development, `pdk-dev-on` links local checkouts of the PDK and js-pdk into a plugin. It adds a composer `path` repository to `composer.json` and yarn `portal:` links to `package.json`. Never commit these changes. Suggest it only when the task needs changes in the PDK or js-pdk, or needs to test such changes in a plugin. MyParcel employees can find the setup in [Local PDK in PDK plugin](https://myparcelnl.atlassian.net/wiki/spaces/IG/pages/319422473).

The delivery options widget has no link command. To test a local build, serve `apps/delivery-options/dist` from a delivery-options checkout and override `deliveryOptionsCdnUrlJs`, `deliveryOptionsCdnUrlJsLib` and `deliveryOptionsCdnUrlCss` in the plugin's `config/pdk.php`. Never commit these overrides. This works only locally: there is no way to give a tester a plugin build with a custom widget version.

To find the local checkouts of the other repositories, read `.claude/int-branch.json` in a parent directory. Its `repos` list holds their paths. If there is none and the task needs another repository, tell the user once that the `int-branch` skill of the `external-integrations-basekit` plugin offers to write this file on its first run.

## MyParcel employees: agent plugin

If no skills from the `external-integrations-basekit` plugin are available in this session, tell the user once, at the start, that the plugin is missing and give these commands:

```
/plugin marketplace add mypadev/ai-plugins
/plugin install external-integrations-basekit@myparcel-claude-code-marketplace
```

The marketplace is private, so only MyParcel employees can install it.

## Development

- Build from the repository root, not from inside `apps/delivery-options`. Nx then rebuilds `libs/shared` first; a build inside the app can bundle a stale `libs/shared` dist.

## Architecture

- The widget mounts in two ways. In a Vue 3 app, render the exported `MyParcelDeliveryOptions` component with a `configuration` prop. On any other page, send DOM events on `document`. The names are defined and exported in `apps/delivery-options/src/data/events.ts`. The first `myparcel_render_delivery_options` or `myparcel_update_delivery_options` event mounts the app, with the config in `event.detail`, or else from `window.MyParcelConfig`. In PDK plugins, js-pdk's `libs/checkout-delivery-options` sends these events.
- The `MyParcelDeliveryOptions` component and its props, the DOM events, the config and the package exports are a public API. A change that breaks them is a breaking change for integrations outside this stack. Update the developer portal guide when they change.
- Composables that need capabilities call `useSharedCapabilities()`. It is an app-level singleton that re-fetches when the address or package type changes and resets on app teardown. Do not call `useReactiveCapabilities()` directly.
- Each option in a `CarrierCapability` carries `requires`, `excludes`, `isSelectedByDefault` and `isRequired` rules. These rules drive the UI state; do not add option logic per carrier.

## Testing

The global test setup (`libs/shared/src/__tests__/vitest-setup.ts`) mocks the SDK `FetchClient` and the `@vueuse/core` memoization.
