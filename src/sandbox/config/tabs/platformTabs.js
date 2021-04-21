import * as PLATFORMS from '@/data/keys/platformKeys';

export const platformTabs = [
  {
    name: PLATFORMS.MYPARCEL,
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
    name: PLATFORMS.SENDMYPARCEL,
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
