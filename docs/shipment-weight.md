# Optional shipment weight

An integration can provide the complete shipment weight in grams. Delivery Options includes it in the existing capabilities request. The capabilities response determines which delivery types are available. Merchant settings still apply; the widget does not change them or define local carrier weight limits.

```json
{
  "config": {
    "physicalProperties": {
      "weight": {"value": 30000, "unit": "g"}
    }
  }
}
```

`config.physicalProperties` is optional and defaults to `null`. Its supported value is an object with `weight.value` as a positive safe integer and `weight.unit` as `"g"`. A weight of 1 gram is valid. No other physical properties are forwarded in this version.

Provide the total weight, including product quantities and packaging, only when it is fully known. An integration that has missing product weights must omit `physicalProperties` or set it to `null`. Do not replace an unknown weight with 1 gram. Invalid values are logged and ignored; the request then has the same body as an integration that does not supply a weight.

## Cart updates

Send the new configuration through the existing configuration update API or event when quantities, variants or packaging change. A changed weight triggers a capabilities request; sending the same weight again does not.

To clear a previous weight, omit `physicalProperties` from the new configuration or set it to `null`. A configuration update uses the default `null`, so the previous weight is not retained. An address-only update does not replace the configuration.

While an updated capabilities request is loading, the widget does not emit a stale selection. If no pickup option remains available, the pickup location and selection are cleared. If another carrier still offers pickup, the existing pickup flow can select one of its locations. A valid selection is required before output is emitted. Returning to a lighter or unknown weight can make pickup available again; it does not restore the old selection automatically.

Capabilities failures use the existing widget error handling. There is no weight-specific retry without weight. A valid response with no options remains an empty result.

When an integration supplies a selected carrier contract and a weighted response includes contract IDs, the widget uses that contract's capabilities. It does not borrow options from another explicit contract. Legacy requests and older proxies without contract data retain their existing lookup behavior. Verify actual API responses for shops with multiple contracts before release; mocked tests cannot establish the live contract-selection policy.

## Sandbox

The sandbox contains a **Shipment weight (g)** field. Enter a positive integer to send a weight, and clear the field to test unknown weight. Inspect the capabilities request and the displayed options while changing weights. The sandbox does not enforce carrier-specific limits locally.
