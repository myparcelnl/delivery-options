/**
 * Checks if searchItem is present or not in the FilterableOption's items based on the "allow" property.
 *
 * @param {MyParcelDeliveryOptions.FilterableOption} filterableOption
 * @param {String} searchItem
 *
 * @returns {Boolean}
 */
export function hasFilterableValue(filterableOption, searchItem) {
  const isWhitelist = filterableOption.allow;

  return filterableOption.items.includes(searchItem) === isWhitelist;
}
