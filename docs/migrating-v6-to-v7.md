# Migrating from v6 to v7

Version 7 removes statically embedded platform configurations (MyParcel NL / SendMyParcel BE) in favor of fetching carrier capabilities at runtime from a backend proxy that you control. This is a **breaking change** that requires changes to your integration.

## Required: implement a capabilities proxy

The widget no longer knows which carriers or delivery options are available by default. Instead, it POSTs a `CapabilitiesRequest` to the URL you supply in the `proxyCapabilities` config field, and uses the response to decide what to show.

### 1. Add `proxyCapabilities` to your config

```js
MyParcelConfig = {
  config: {
    proxyCapabilities: 'https://your-backend.example/myparcel/capabilities',
    // ... rest of your config
  },
};
```

### 2. Implement the proxy endpoint

Your backend must accept a `POST` request with a JSON body matching the `CapabilitiesRequest` shape, forward it to the MyParcel API, and return the response unchanged.

**Endpoint**: `POST https://api.myparcel.nl/shipments/capabilities`
**Authentication**: Bearer token with `selectShipment` scope
**OpenAPI spec**: <https://api.myparcel.nl/openapi.min.json> (operation: `postCapabilities`)

**Request body shape** (forwarded from the widget as-is):

```ts
interface CapabilitiesRequest {
  recipient: {
    countryCode: string;
    postalCode?: string;
    isBusiness?: boolean;
  };
  sender?: {
    countryCode?: string;
    postalCode?: string;
    isBusiness?: boolean;
  };
  packageType?: string;
  carrier?: string;
  options?: Record<string, Record<string, never>>;
  deliveryType?: string;
  shopId?: number;
  direction?: 'INBOUND' | 'OUTBOUND';
  pickup?: {location?: {type?: 'RETAIL' | 'LOCKER'}};
  physicalProperties?: {
    height?: {value: number; unit: string};
    width?: {value: number; unit: string};
    length?: {value: number; unit: string};
    weight?: {value: number; unit: string};
  };
}
```

In practice the widget only populates `recipient` (from the current address) and
`packageType` (when supplied by the integrating platform from the cart). All other
fields — `deliveryType`, `options`, `carrier`, `sender`, etc. — are intentionally
omitted: the response carries `requires`/`excludes` rules per option, and the
widget filters client-side so it doesn't need to refetch on every user selection.
Your proxy should forward whatever it receives unchanged.

**Response shape** (return this directly to the widget):

```ts
interface CapabilitiesResponse {
  results: Array<{
    carrier: string;
    packageTypes: string[];
    deliveryTypes: string[];
    options: Record<
      string,
      {
        requires: string[];
        excludes: string[];
        isSelectedByDefault: boolean;
        isRequired: boolean;
      }
    >;
    transactionTypes?: string[];
    physicalProperties?: Record<string, unknown>;
    collo?: {max: number};
  }>;
}
```

**Minimal proxy example (Node.js / Express)**:

```js
app.post('/myparcel/capabilities', async (req, res) => {
  const response = await fetch(
    'https://api.myparcel.nl/shipments/capabilities',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8;version=2.0',
        Authorization: `Bearer ${Buffer.from(
          process.env.MYPARCEL_API_KEY,
        ).toString('base64')}`,
      },
      body: JSON.stringify(req.body),
    },
  );
  const data = await response.json();
  res.status(response.status).json(data);
});
```

### Development / testing only: `apiKey`

For local development you can skip the proxy by passing your API key directly in the config:

```js
config: {
  apiKey: 'your-api-key', // base64-encoded by the widget internally
}
```

**Do not use `apiKey` in production.** The widget logs a warning when it is present. The proxy approach keeps your API key server-side.

---

## Config changes

### New required field

| Field               | Type     | Description                                   |
| ------------------- | -------- | --------------------------------------------- |
| `proxyCapabilities` | `string` | URL the widget POSTs capabilities requests to |

### Removed fields

| Field                                    | Notes                                                             |
| ---------------------------------------- | ----------------------------------------------------------------- |
| `allowDeliveryOptions` (carrier setting) | Removed — use capabilities response to control available carriers |
| `showDeliveryDate`                       | Removed                                                           |

### Changed fields

| Field         | Change                                                     |
| ------------- | ---------------------------------------------------------- |
| `dropOffDays` | No longer accepts a plain string; must be `DropOffEntry[]` |

### Removed: deprecated options

The `DeprecatedConfigOptions` group is no longer accepted. Any previously deprecated config keys passed in `config` are now silently ignored rather than mapped. Audit your config object and remove any deprecated keys before upgrading.

---

## Behavior changes

### Address validation no longer prevents carriers from showing up

In v6 if a carrier returned with an error when asking for delivery moments, for example a malformed address, an error would be shown, e.g. missing postal code. In v7 there is no such address validation, choices that are available according to capabilities will be shown. Address validation must be performed separately.

---

## Removed exports

The following were removed from `@myparcel/delivery-options` and `@myparcel-dev/do-shared`:

| Export                            | Replacement                                                                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `PlatformConfiguration` type      | No direct replacement — capabilities response drives platform behaviour                                                         |
| `PlatformName` enum               | Not replaced. `platform` is still a required config field, just pass the platform string received from the api for the api key. |
| `usePlatform()` composable        | No direct replacement                                                                                                           |
| `getDefaultConfigForPlatform()`   | No direct replacement                                                                                                           |
| `useCurrentPlatform()` composable | No direct replacement                                                                                                           |

If you were importing any of these, remove the imports and rely on the capabilities response instead.
