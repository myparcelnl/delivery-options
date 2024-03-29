import * as ADDRESS from '@/data/keys/addressKeys';
import * as CONFIG from '@/data/keys/configKeys';
import * as FORM from '@/config/formConfig';
import * as STRINGS from '@/data/keys/stringsKeys';

export const englishTranslations = {
  'code.description': 'When you adjust the settings in the left column, you will see the changes reflected in the code below. This is a complete configuration object for use with the Delivery Options module. You could build this object manually, but it\'s more reliable to retrieve its properties using a (rest) API.',
  'code_formats.javascript': 'JavaScript',
  'code_formats.javascript_es6': 'JavaScript (ES2015+)',
  'code_formats.json': 'JSON',
  'field.carrier': 'Carriers',
  'field.platform': 'Platform',
  'links.api_documentation': 'API Documentation',
  'links.backoffice': 'Backoffice',
  'links.slack': 'Slack',
  'links.website': 'Website',
  'main.description': 'This sandbox is made to test different configurations of the MyParcel Delivery Options. On the left you can see all possible options. Change the options and see the results reflected on the right immediately. Open the "@:tab.code" tab to get the code you need to use with the Delivery Options. More information on each setting can be found in our <a href="https://myparcelnl.github.io/api/#8">API documentation</a>.',
  'main.slack_help': ' Do you want to be kept informed of new functionalities or do you need help? You can contact us via <a href="https://myparcelnl.github.io/api/#8">Slack</a>.',
  'package_types.digital_stamp': 'Digital stamp',
  'package_types.mailbox': 'Mailbox package',
  'package_types.package': 'Package',
  'pickup_locations.views.list': 'List',
  'pickup_locations.views.map': 'Map',
  'platform.belgie': 'SendMyParcel (Belgium)',
  'platform.myparcel': 'MyParcel (The Netherlands)',
  'result.title': 'Result',
  'settings.title': 'Settings',
  'tab.code': 'Code',
  'tab.delivery_options': 'Delivery Options',
  default_placeholder: '<Default>',

  [`field.${ADDRESS.CC}`]: 'Country',
  [`field.${ADDRESS.CITY}`]: 'City',
  [`field.${ADDRESS.KEY}`]: 'Address',
  [`field.${ADDRESS.NUMBER}`]: 'Number',
  [`field.${ADDRESS.STREET}`]: 'Street',
  [`field.${ADDRESS.POSTAL_CODE}`]: 'Postal code',
  [`field.${CONFIG.ALLOW_DELIVERY_OPTIONS}`]: 'Allow delivery options',
  [`field.${CONFIG.ALLOW_EVENING_DELIVERY}`]: 'Allow evening delivery',
  [`field.${CONFIG.ALLOW_MONDAY_DELIVERY}.description`]: `Monday delivery is only possible if the package is delivered before <code>15:00</code> on Saturday at the post office. Note: To activate Monday delivery, Saturday must be present in "@:field.${CONFIG.DROP_OFF_DAYS}". On Saturday the cutoff time must be before <code>15:00</code> (<code>14:30</code> recommended) to allow Monday to be shown in the delivery options. <a href="https://blog.myparcel.nl/maandagbezorging/" target="_blank">More information about this free service</a>`,
  [`field.${CONFIG.ALLOW_MONDAY_DELIVERY}`]: 'Allow Monday delivery',
  [`field.${CONFIG.ALLOW_MORNING_DELIVERY}`]: 'Allow morning delivery',
  [`field.${CONFIG.ALLOW_ONLY_RECIPIENT}`]: 'Allow only recipient',
  [`field.${CONFIG.ALLOW_PICKUP_LOCATIONS}`]: 'Allow pickup locations',
  [`field.${CONFIG.ALLOW_SAME_DAY_DELIVERY}.description`]: `Same day delivery is only possible when "@:field.${CONFIG.DROP_OFF_DAYS}" is 0.`,
  [`field.${CONFIG.ALLOW_SAME_DAY_DELIVERY}`]: 'Allow same day delivery',
  [`field.${CONFIG.ALLOW_SATURDAY_DELIVERY}.description`]: `Saturday delivery is only possible when the package is delivered before <code>15:00</code> on Friday at the designated bpost locations. <strong>Note: To allow Saturday delivery, Friday must be enabled in <code>@:field.${CONFIG.DROP_OFF_DAYS}</code>.</strong>`,
  [`field.${CONFIG.ALLOW_SATURDAY_DELIVERY}`]: 'Allow Saturday delivery',
  [`field.${CONFIG.ALLOW_SIGNATURE}`]: 'Allow signature',
  [`field.${CONFIG.CURRENCY}.description`]: 'The currency to display prices in. Default: <code>EUR</code>',
  [`field.${CONFIG.CURRENCY}`]: 'Currency',
  [`field.${CONFIG.CUTOFF_TIME_SAME_DAY}.description`]: 'The latest time an order will be picked, packed, dispatched and delivered when using same day delivery. Must be between <code>00:00</code> and <code>09:30</code>',
  [`field.${CONFIG.CUTOFF_TIME_SAME_DAY}`]: 'Cutoff time (same day)',
  [`field.${CONFIG.CUTOFF_TIME}.description`]: 'The latest time an order will still be picked, packed and dispatched on the same/first set dropoff day, taking the dropoff delay into account. (Industry standard) default time is <code>17:00</code>. For example, if cutoff time is <code>17:00</code>, Wednesday is a delivery day and there\'s no delivery delay; all orders placed Wednesday before <code>17:00</code> will be dropped of on that same Wednesday in time for the Wednesday collection and delivery on Thursday.',
  [`field.${CONFIG.CUTOFF_TIME}`]: 'Cutoff time',
  [`field.${CONFIG.DELIVERY_DAYS_WINDOW}.description`]: 'The number of days into the future for which you want to show delivery days. For example; If set to 3, a consumer ordering on Monday will see possible delivery options for Tuesday, Wednesday and Thursday (provided there is no drop-off delay and it\'s before the cutoff time). The minimum is <code>1</code> and maximum is <code>14</code> days.',
  [`field.${CONFIG.DELIVERY_DAYS_WINDOW}`]: 'Delivery days window',
  [`field.${CONFIG.DROP_OFF_DAYS}.description`]: 'The days you normally hand in your parcels.',
  [`field.${CONFIG.DROP_OFF_DAYS}`]: 'Drop-off days',
  [`field.${CONFIG.DROP_OFF_DELAY}.description`]: 'The number of days it takes you to pick, pack and hand in your parcel at the post office (if ordered before the cutoff time). By default this is <code>0</code> and the maximum is <code>14</code>.',
  [`field.${CONFIG.DROP_OFF_DELAY}`]: 'Drop-off delay',
  [`field.${CONFIG.FEATURE_ALLOW_RETRY}.description`]: 'When the address is invalid, show a "retry" prompt where users can update their address.',
  [`field.${CONFIG.FEATURE_ALLOW_RETRY}`]: 'Enable retry button',
  [`field.${CONFIG.FEATURE_MAX_PAGE_ITEMS}.description`]: `Amount of items shown in the pickup locations list view. There will be a "@:field.${STRINGS.LOAD_MORE}" button, this does not impact the actual amount loaded.`,
  [`field.${CONFIG.FEATURE_MAX_PAGE_ITEMS}`]: 'Pickup items per page',
  [`field.${CONFIG.FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW}`]: 'Default pickup view',
  [`field.${CONFIG.FEATURE_PICKUP_SHOW_DISTANCE}`]: 'Show distances',
  [`field.${CONFIG.FEATURE_SHOW_DELIVERY_DATE}`]: 'Show delivery date',
  [`field.${CONFIG.FRIDAY_CUTOFF_TIME}.description`]: `Like the regular "@:field.${CONFIG.CUTOFF_TIME}" setting: This option allows you to indicate the latest cutoff time before an order will still be picked, packed and dispatched on the same/first set dropoff day, taking the dropoff delay into account.`,
  [`field.${CONFIG.FRIDAY_CUTOFF_TIME}`]: 'Friday cutoff time',
  [`field.${CONFIG.PACKAGE_TYPE}`]: 'Package type',
  [`field.${CONFIG.PICKUP_LOCATIONS_MAP_TILE_LAYER_DATA}.description`]: 'We already entered a default value, but if you want to customize your pickup locations map you can find more tile layers <a href="https://leaflet-extras.github.io/leaflet-providers/preview/" target="_blank">here</a>. This field must contain valid JSON.',
  [`field.${CONFIG.PICKUP_LOCATIONS_MAP_TILE_LAYER_DATA}`]: 'Map tile layer data',
  [`field.${CONFIG.PRICE_EVENING_DELIVERY}.description`]: `@:field.${CONFIG.PRICE_STANDARD_DELIVERY}.description`,
  [`field.${CONFIG.PRICE_EVENING_DELIVERY}`]: 'Evening delivery price',
  [`field.${CONFIG.PRICE_MORNING_DELIVERY}.description`]: `@:field.${CONFIG.PRICE_STANDARD_DELIVERY}.description`,
  [`field.${CONFIG.PRICE_MORNING_DELIVERY}`]: 'Morning delivery price',
  [`field.${CONFIG.PRICE_ONLY_RECIPIENT}.description`]: `@:field.${CONFIG.PRICE_STANDARD_DELIVERY}.description`,
  [`field.${CONFIG.PRICE_ONLY_RECIPIENT}`]: 'Only recipient price',
  [`field.${CONFIG.PRICE_PACKAGE_TYPE_DIGITAL_STAMP}`]: 'Digital stamp price',
  [`field.${CONFIG.PRICE_PACKAGE_TYPE_MAILBOX}`]: 'Mailbox package price',
  [`field.${CONFIG.PRICE_PICKUP}.description`]: `@:field.${CONFIG.PRICE_STANDARD_DELIVERY}.description`,
  [`field.${CONFIG.PRICE_PICKUP}.description`]: `@:field.${CONFIG.PRICE_STANDARD_DELIVERY}.description`,
  [`field.${CONFIG.PRICE_PICKUP}`]: 'Pickup price',
  [`field.${CONFIG.PRICE_SAME_DAY_DELIVERY}.description`]: `@:field.${CONFIG.PRICE_STANDARD_DELIVERY}.description`,
  [`field.${CONFIG.PRICE_SAME_DAY_DELIVERY}`]: 'Same day delivery price',
  [`field.${CONFIG.PRICE_SIGNATURE}.description`]: `@:field.${CONFIG.PRICE_STANDARD_DELIVERY}.description`,
  [`field.${CONFIG.PRICE_SIGNATURE}`]: 'Signature price',
  [`field.${CONFIG.PRICE_STANDARD_DELIVERY}.description`]: 'The amount of money you charge for this feature. If the amount is negative the price will appear green in the delivery options to show it\'s a discount.',
  [`field.${CONFIG.PRICE_STANDARD_DELIVERY}`]: 'Standard delivery price',
  [`field.${CONFIG.SATURDAY_CUTOFF_TIME}.description`]: `Like the regular "@:field.${CONFIG.CUTOFF_TIME}" setting: This option allows you to indicate the latest cutoff time before an order will still be picked, packed and dispatched on the same/first set dropoff day, taking the dropoff delay into account.`,
  [`field.${CONFIG.SATURDAY_CUTOFF_TIME}`]: 'Saturday cutoff time',
  [`field.${CONFIG.SUNDAY_CUTOFF_TIME}`]: 'Sunday cutoff time',
  [`field.${CONFIG.SHOW_PRICES}.description`]: 'Disable to not show prices anywhere at all.',
  [`field.${CONFIG.SHOW_PRICES}`]: 'Show prices',
  [`field.${CONFIG.SHOW_PRICE_SURCHARGE}.description`]: 'Enable to show price as surcharge rather than total price.',
  [`field.${CONFIG.SHOW_PRICE_SURCHARGE}`]: 'Show price as surcharge',

  [`field.${STRINGS.ADDRESS_NOT_FOUND}`]: 'Address not found',
  [`field.${STRINGS.CLOSED}.description`]: 'Used in opening hours for pickup locations.',
  [`field.${STRINGS.CLOSED}`]: 'Closed',
  [`field.${STRINGS.DELIVERY_EVENING_TITLE}.description`]: `@:field.${STRINGS.DELIVERY_STANDARD_TITLE}.description`,
  [`field.${STRINGS.DELIVERY_EVENING_TITLE}`]: 'Evening delivery title',
  [`field.${STRINGS.MONDAY_DELIVERY_TITLE}`]: 'Monday delivery title',
  [`field.${STRINGS.DELIVERY_MORNING_TITLE}.description`]: `@:field.${STRINGS.DELIVERY_STANDARD_TITLE}.description`,
  [`field.${STRINGS.DELIVERY_MORNING_TITLE}`]: 'Morning delivery title',
  [`field.${STRINGS.SATURDAY_DELIVERY_TITLE}`]: 'Saturday delivery title',
  [`field.${STRINGS.DELIVERY_STANDARD_TITLE}.description`]: 'When there is no title, the delivery time will automatically be visible.',
  [`field.${STRINGS.DELIVERY_STANDARD_TITLE}`]: 'Standard delivery title',
  [`field.${STRINGS.DELIVERY_TITLE}`]: 'Delivery choice text',
  [`field.${STRINGS.FROM}`]: 'From',
  [`field.${STRINGS.HEADER_DELIVERY_OPTIONS}.description`]: 'Optional header displayed above the delivery options. Leave empty to not show header at all.',
  [`field.${STRINGS.HEADER_DELIVERY_OPTIONS}`]: 'Header',
  [`field.${STRINGS.LOAD_MORE}.description`]: 'Text in the link that appears on the bottom of the pickup locations list view if there are more results than are currently visible.',
  [`field.${STRINGS.LOAD_MORE}`]: 'Load more',
  [`field.${STRINGS.ONLY_RECIPIENT_TITLE}.description`]: `String to use with "@:field.${CONFIG.ALLOW_ONLY_RECIPIENT}"`,
  [`field.${STRINGS.ONLY_RECIPIENT_TITLE}`]: 'Only recipient title',
  [`field.${STRINGS.PICKUP_LOCATIONS_LIST_BUTTON}`]: 'Pickup locations "list" button',
  [`field.${STRINGS.PICKUP_LOCATIONS_MAP_BUTTON}`]: 'Pickup locations "map" button',
  [`field.${STRINGS.PICKUP_TITLE}.description`]: `String to use with "@:field.${CONFIG.ALLOW_PICKUP_LOCATIONS}"`,
  [`field.${STRINGS.PICKUP_TITLE}`]: 'Pickup choice text',
  [`field.${STRINGS.PICK_UP}`]: 'Pick up',
  [`field.${STRINGS.PICK_UP_FROM}`]: 'Pick up from',
  [`field.${STRINGS.POSTAL_CODE}`]: 'Postal code',
  [`field.${STRINGS.RETRY}.description`]: `String to use with "@:field.${CONFIG.FEATURE_ALLOW_RETRY}"`,
  [`field.${STRINGS.RETRY}`]: 'Retry',
  [`field.${STRINGS.SIGNATURE_TITLE}.description`]: `String to use with "@:field.${CONFIG.ALLOW_SIGNATURE}"`,
  [`field.${STRINGS.SIGNATURE_TITLE}`]: 'Signature title',
  [`field.${STRINGS.WRONG_NUMBER_POSTAL_CODE}`]: 'Wrong number & postal code',
  [`field.${STRINGS.WRONG_NUMBER_POSTAL_CODE}.description`]: 'NL only',
  [`field.${STRINGS.WRONG_POSTAL_CODE_CITY}`]: 'Wrong postal code & city',
  [`field.${STRINGS.WRONG_POSTAL_CODE_CITY}.description`]: 'BE only',

  'title.dropoff': 'Dropoff configuration',
  'title.dropoff.description': 'Configure how and when you hand over parcels to carriers.',
  'title.features': 'Features',
  'title.general': 'General',
  'title.main': 'Delivery options sandbox',
  'title.strings_other': 'Other strings',
  [`title.${FORM.DELIVERY_EVENING}`]: 'Evening delivery',
  [`title.${FORM.DELIVERY_MORNING}`]: 'Morning delivery',
  [`title.${FORM.DELIVERY_SAME_DAY}`]: 'Same day delivery',
  [`title.${FORM.DELIVERY_STANDARD}`]: 'Standard delivery',
  [`title.${FORM.DELIVERY}`]: 'Delivery',
  [`title.${FORM.MONDAY_DELIVERY}`]: 'Monday delivery',
  [`title.${FORM.ONLY_RECIPIENT}`]: 'Only recipient',
  [`title.${FORM.PACKAGE_TYPE}`]: 'Package type',
  [`title.${FORM.PICKUP}`]: 'Pickup',
  [`title.${FORM.SATURDAY_DELIVERY}`]: 'Saturday delivery',
  [`title.${FORM.SHIPMENT_OPTIONS}`]: 'Shipment options',
  [`title.${FORM.SIGNATURE}`]: 'Signature',
  [`title.${STRINGS.KEY}`]: 'Strings',
};
