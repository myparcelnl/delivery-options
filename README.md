# MyParcel Delivery Options

[![NPM](https://img.shields.io/npm/v/@myparcel/delivery-options?style=for-the-badge)](https://www.npmjs.com/package/@myparcel/delivery-options/)
[![Coverage Status](https://img.shields.io/codecov/c/github/myparcelnl/delivery-options?logo=codecov&style=for-the-badge)](https://codecov.io/gh/myparcelnl/delivery-options)

[![Sandbox](https://img.shields.io/badge/-Sandbox-lightblue?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAADIAAAAyAEU/dc7AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAGxQTFRF////KysrLhcXKxUrIiIiHh4eJCQkIyMjICAgJBskIyMjIiIiICAgIx0jJCAgJCAgIh4iIR4hJB8fIh4gIx8fIx8gIx8hIx8gJB8gIyAgIx8gIx8gIh8gIx8gIx8gIx8gIx8fIx8gIx8gIx8gvcsSrgAAACN0Uk5TAAYLDA8RFRYYHB0mKCw/QERFaoaav8TO0NLn6fT2+Pn7/f5ZFmViAAAAeElEQVQYV42NSxaCQAwEW1QQQUBA5M9A3/+OZhgybK1F3qtapAFPvpHsEZRNK3xfyCYjBRUdbyDsbBjWIhWS3TtDcD5eWA+nzYfdkeUanFtcuDm/XjREvfV4+WjA8y4nZYtz5f8wmocPBRugppmVlaVM1SOVoQrwA9cyDpymMUbnAAAAAElFTkSuQmCC)](https://alpha--myparcel-delivery-options.netlify.app/)

## Introduction

This is the MyParcel delivery options module for use in any e-commerce platform's checkout, by [MyParcel] and [SendMyParcel] customers. It's used to show your customers the possible delivery and/or pickup options for their location, based on your settings.

## Documentation

Read the [documentation].

## Contributing

Please read our [contribution guidelines](CONTRIBUTING.md)

## Changelog

See the [GitHub releases page] or [CHANGELOG.md].

## Upgrading

### v5 to v6

Most of the big changes in v6 are internal, but there are some breaking changes and deprecations.

**Improvements**

- A beautiful new design.
- Vastly improved performance and stability.
- The app can now be used as a Vue component in any Vue 3 app.
- TypeScript support.
- More exported methods, constants, types and interfaces.

**Breaking changes**

- It's no longer possible to set `showDeliveryDate` per carrier. This is now a global setting only.

**Deprecated**

- `cutoffTime` is deprecated, use `dropOffDays` instead
- Rather than relying on `allowDeliveryOptions`, use `allowStandardDelivery` instead.

> ⚠️ **Note:** The existing behavior will continue to work throughout v6 but will be removed/changed in the next major version.

**New features**

- It's now possible to set separate cutoff times per day and per carrier.

**Internal changes**

- The app is now written in TypeScript.
- Upgraded from Vue 2 to Vue 3.
- Upgraded from Vue CLI to Vite.

[CHANGELOG.md]: ./apps/delivery-options/CHANGELOG.md
[Github releases page]: https://github.com/myparcelnl/delivery-options/releases
[MyParcel]: https://myparcel.nl
[SendMyParcel]: https://sendmyparcel.be
[documentation]: https://developer.myparcel.nl/documentation/60.delivery-options.html
[sandbox]: https://myparcelnl.github.io/delivery-options
