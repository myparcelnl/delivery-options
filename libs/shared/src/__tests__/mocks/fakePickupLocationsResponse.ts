import {type PickupLocation} from '@myparcel/sdk';
import {DeliveryTypeId, DeliveryTypeName} from '@myparcel/constants';

export const fakePickupLocationsResponse = (): PickupLocation[] => [
  {
    address: {
      cc: 'NL',
      city: 'HOOFDDORP',
      street: 'Daalmeerstraat',
      postal_code: '2131HD',
      number: '15',
      number_suffix: '',
    },
    possibilities: [
      {
        delivery_type_id: DeliveryTypeId.Pickup,
        delivery_type_name: DeliveryTypeName.Pickup,
        moment: {
          start: {date: '2023-12-23 16:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
        },
        price: 0,
      },
    ],
    location: {
      location_name: 'TRINOVA Ventures BV',
      retail_network_id: 'PNPNL-01',
      distance: '2451',
      latitude: '52.31482709',
      longitude: '4.69508101',
      location_code: '397882',
      phone_number: null,
      opening_hours: {
        monday: [
          {
            start: {date: '2023-12-25 09:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-25 18:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        tuesday: [
          {
            start: {date: '2023-12-26 09:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-26 18:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        wednesday: [
          {
            start: {date: '2023-12-27 09:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-27 18:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        thursday: [
          {
            start: {date: '2023-12-28 09:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-28 18:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        friday: [
          {
            start: {date: '2023-12-22 09:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-22 18:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        saturday: [],
        sunday: [],
      },
    },
  },
  {
    address: {
      cc: 'NL',
      city: 'Rijsenhout',
      street: 'Werf',
      postal_code: '1435KP',
      number: '15',
      number_suffix: 'PBA',
    },
    possibilities: [
      {
        delivery_type_id: DeliveryTypeId.Pickup,
        delivery_type_name: DeliveryTypeName.Pickup,
        moment: {
          start: {date: '2023-12-23 16:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
        },
        price: 0,
      },
    ],
    location: {
      location_name: 'Pakketautomaat',
      retail_network_id: 'PNPNL-01',
      distance: '4055',
      latitude: '52.25857847',
      longitude: '4.71502639',
      location_code: '261534',
      phone_number: null,
      opening_hours: {
        monday: [
          {
            start: {date: '2023-12-25 07:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-25 20:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        tuesday: [
          {
            start: {date: '2023-12-26 07:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-26 20:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        wednesday: [
          {
            start: {date: '2023-12-27 07:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-27 20:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        thursday: [
          {
            start: {date: '2023-12-28 07:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-28 20:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        friday: [
          {
            start: {date: '2023-12-22 07:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-22 20:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        saturday: [
          {
            start: {date: '2023-12-23 07:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-23 20:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        sunday: [
          {
            start: {date: '2023-12-24 11:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-24 18:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
      },
    },
  },
  {
    address: {
      cc: 'NL',
      city: 'SCHIPHOL',
      street: 'Aankomstpassage',
      postal_code: '1118AX',
      number: '4',
      number_suffix: '',
    },
    possibilities: [
      {
        delivery_type_id: DeliveryTypeId.Pickup,
        delivery_type_name: DeliveryTypeName.Pickup,
        moment: {
          start: {date: '2023-12-23 16:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
        },
        price: 0,
      },
    ],
    location: {
      location_name: 'Service Point Schiphol Plaza',
      retail_network_id: 'PNPNL-01',
      distance: '3952',
      latitude: '52.31018218',
      longitude: '4.76326748',
      location_code: '176688',
      phone_number: null,
      opening_hours: {
        monday: [
          {
            start: {date: '2023-12-25 07:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-25 22:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        tuesday: [
          {
            start: {date: '2023-12-26 07:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-26 22:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        wednesday: [
          {
            start: {date: '2023-12-27 07:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-27 22:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        thursday: [
          {
            start: {date: '2023-12-28 07:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-28 22:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        friday: [
          {
            start: {date: '2023-12-22 07:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-22 22:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        saturday: [
          {
            start: {date: '2023-12-23 07:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-23 22:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        sunday: [
          {
            start: {date: '2023-12-24 07:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-24 22:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
      },
    },
  },
  {
    address: {
      cc: 'NL',
      city: 'Aalsmeer',
      street: 'Poldermeesterplein',
      postal_code: '1432JZ',
      number: '5',
      number_suffix: '',
    },
    possibilities: [
      {
        delivery_type_id: DeliveryTypeId.Pickup,
        delivery_type_name: DeliveryTypeName.Pickup,
        moment: {
          start: {date: '2023-12-23 16:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
        },
        price: 0,
      },
    ],
    location: {
      location_name: 'Primera Carina Aalsmeer',
      retail_network_id: 'PNPNL-01',
      distance: '6146',
      latitude: '52.27465323',
      longitude: '4.79478458',
      location_code: '217862',
      phone_number: null,
      opening_hours: {
        monday: [
          {
            start: {date: '2023-12-25 09:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-25 18:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        tuesday: [
          {
            start: {date: '2023-12-26 09:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-26 18:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        wednesday: [
          {
            start: {date: '2023-12-27 09:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-27 18:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        thursday: [
          {
            start: {date: '2023-12-28 09:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-28 18:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        friday: [
          {
            start: {date: '2023-12-22 09:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-22 18:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        saturday: [
          {
            start: {date: '2023-12-23 09:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-23 17:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        sunday: [],
      },
    },
  },
  {
    address: {
      cc: 'NL',
      city: 'Nieuw-Vennep',
      street: 'De Symfonie',
      postal_code: '2151MD',
      number: '37',
      number_suffix: '',
    },
    possibilities: [
      {
        delivery_type_id: DeliveryTypeId.Pickup,
        delivery_type_name: DeliveryTypeName.Pickup,
        moment: {
          start: {date: '2023-12-23 16:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
        },
        price: 0,
      },
    ],
    location: {
      location_name: 'Bruna',
      retail_network_id: 'PNPNL-01',
      distance: '6327',
      latitude: '52.26462063',
      longitude: '4.63203633',
      location_code: '161943',
      phone_number: null,
      opening_hours: {
        monday: [
          {
            start: {date: '2023-12-25 09:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-25 18:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        tuesday: [
          {
            start: {date: '2023-12-26 09:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-26 18:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        wednesday: [
          {
            start: {date: '2023-12-27 09:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-27 18:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        thursday: [
          {
            start: {date: '2023-12-28 09:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-28 18:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        friday: [
          {
            start: {date: '2023-12-22 09:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-22 18:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        saturday: [
          {
            start: {date: '2023-12-23 09:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-23 17:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
        sunday: [
          {
            start: {date: '2023-12-24 12:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
            end: {date: '2023-12-24 17:00:00.000000', timezone_type: 3, timezone: 'Europe/Amsterdam'},
          },
        ],
      },
    },
  },
];
