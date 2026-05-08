# Adding a New Shipment Option

This guide walks through adding a new shipment option (e.g., `age_check`, `large_format`) to the delivery-options widget.

## Required changes (3 files)

### 1. Add the mapping entry

**File:** `libs/shared/src/utils/capabilitiesMapping.ts`

Add one entry to `SHIPMENT_OPTION_MAP`. The key is the capability name (from the backend), the value is the SDK name used internally.

```ts
export const SHIPMENT_OPTION_MAP = {
  requiresSignature: 'signature',
  recipientOnlyDelivery: 'only_recipient',
  priorityDelivery: 'priority_delivery',
  // Add your new option here:
  yourCapabilityName: 'your_sdk_name',
} as const;
```

Everything else derives automatically from this entry:
- `SUPPORTED_SHIPMENT_OPTIONS` array
- `SHIPMENT_OPTION_ALLOW_DEFAULTS` (defaults to allowed)
- `CAPABILITY_SETTINGS_PAIRS` (allow/price config registration)
- Translation key (`yourSdkNameTitle` via convention)
- Output key (`yourSdkName` via convention)
- `ShipmentOptionsOutput` type
- Config option registration in `getAllConfigOptions()`

### 2. Add enum entries for type safety

**File:** `libs/shared/src/data/enums.ts`

Add `Allow` and `Price` entries to the `CarrierSetting` enum. The names follow the convention `allow/price` + PascalCase of the SDK name.

```ts
export enum CarrierSetting {
  // ...existing entries
  AllowYourSdkName = 'allowYourSdkName',
  PriceYourSdkName = 'priceYourSdkName',
}
```

### 3. Add interface properties

**File:** `libs/shared/src/types/config.types.ts`

Add the corresponding optional properties to the `CarrierSettings` interface:

```ts
export interface CarrierSettings {
  // ...existing properties
  allowYourSdkName?: boolean;
  priceYourSdkName?: Price;
}
```

## Optional changes

### Dutch fallback translation

**File:** `apps/delivery-options/src/config/getDefaultStrings.ts`

Add a Dutch fallback string. The key must match `{camelCase(sdkName)}Title`:

```ts
[yourSdkNameTitle]: 'Dutch translation here',
```

Translations are normally loaded externally (`yarn translations:import`), so this is only a fallback.

### Sandbox configuration (3 files)

#### Sidebar toggle

**File:** `apps/sandbox/src/form/getConfigSandboxSections.ts`

Add `CarrierSetting.AllowYourSdkName` to the `ShipmentOptionsPerPackageType` items array so the toggle appears in the sandbox sidebar:

```ts
{
  name: OptionGroup.ShipmentOptionsPerPackageType,
  items: [
    CarrierSetting.AllowOnlyRecipient,
    CarrierSetting.AllowSignature,
    CarrierSetting.AllowPriorityDelivery,
    CarrierSetting.AllowYourSdkName, // <-- add here
  ],
},
```

#### Default carrier settings

**File:** `apps/sandbox/src/config/getDefaultSandboxCarrierSettings.ts`

Add allow and price entries with random test prices so the option is enabled by default in the sandbox:

```ts
[CarrierSetting.AllowYourSdkName]: true,
[CarrierSetting.PriceYourSdkName]: numberBetween(0.1, 0.9),
```

#### Price field visibility

**File:** `apps/sandbox/src/form/getAllSandboxConfigOptions.ts`

Add allow and price entries to the `extended` array. The `parents` field controls when the price input is visible (only shown when the allow toggle is on):

```ts
{key: CarrierSetting.AllowYourSdkName},
{key: CarrierSetting.PriceYourSdkName, parents: [CarrierSetting.AllowYourSdkName]},
```

## Naming conventions

All derived values follow these conventions from the SDK name (e.g., `only_recipient`):

| Derived value | Convention | Example |
|---|---|---|
| Allow config key | `allow` + PascalCase | `allowOnlyRecipient` |
| Price config key | `price` + PascalCase | `priceOnlyRecipient` |
| Translation key | camelCase + `Title` | `onlyRecipientTitle` |
| Output key | camelCase | `onlyRecipient` |

## How it works

`SHIPMENT_OPTION_MAP` in `capabilitiesMapping.ts` is the single source of truth. The derivation chain:

1. `SUPPORTED_SHIPMENT_OPTIONS` = values of `SHIPMENT_OPTION_MAP`
2. `CAPABILITY_SETTINGS_PAIRS` = allow/price pairs generated via `toOptionAllowKey`/`toOptionPriceKey`
3. `SHIPMENT_OPTION_ALLOW_DEFAULTS` = all options default to `true` (capabilities control availability per carrier)
4. `getAllConfigOptions()` = registers allow/price config options from the pairs
5. `ShipmentOptionsOutput` type = mapped type derived from the map values
6. `TRANSLATION_MAP` in `useShipmentOptionsOptions.ts` = derived at runtime via `toCamelCase(sdk) + 'Title'`
7. `SHIPMENT_OPTION_OUTPUT_MAP` in `useResolvedValues.ts` = derived at runtime via `toCamelCase(sdk)`
