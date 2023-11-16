import {PlatformName} from '@myparcel/constants';

export const platformTabs = [
  {
    name: PlatformName.MyParcel as const,
    human: 'platform.myparcel',
    links: [
      {
        text: 'links.backoffice',
        href: 'https://backoffice.myparcel.nl',
      },
      {
        text: 'links.website',
        href: 'https://myparcel.nl',
      },
    ],
  },
  {
    name: PlatformName.SendMyParcel as const,
    human: 'platform.myparcel',
    links: [
      {
        text: 'links.backoffice',
        href: 'https://backoffice.sendmyparcel.be',
      },
      {
        text: 'links.website',
        href: 'https://sendmyparcel.be',
      },
    ],
  },
];
