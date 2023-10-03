const allCarrierData = [
  {
    id: 1,
    name: 'postnl',
    human: 'PostNL',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/postnl.svg',
      logo_png: '/skin/general-images/carrier-logos/postnl.png',
    },
  },
  {
    id: 2,
    name: 'bpost',
    human: 'bpost',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/bpost.svg',
      logo_png: '/skin/general-images/carrier-logos/bpost.png',
    },
  },
  {
    id: 3,
    name: 'cheapcargo',
    human: 'Cheap Cargo',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/cheapcargo.svg',
      logo_png: '/skin/general-images/carrier-logos/cheapcargo.png',
    },
  },
  {
    id: 4,
    name: 'dpd',
    human: 'DPD',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/dpd.svg',
      logo_png: '/skin/general-images/carrier-logos/dpd.png',
    },
  },
  {
    id: 6,
    name: 'dhl',
    human: 'DHL',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/dhl.svg',
      logo_png: '/skin/general-images/carrier-logos/dhl.png',
    },
  },
  {
    id: 8,
    name: 'ups',
    human: 'UPS',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/ups.svg',
      logo_png: '/skin/general-images/carrier-logos/ups.png',
    },
  },
  {
    id: 7,
    name: 'bol.com',
    human: 'Bol.com',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/bol.com.svg',
      logo_png: '/skin/general-images/carrier-logos/bol.com.png',
    },
  },
  {
    id: 5,
    name: 'instabox',
    human: 'Instabox',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/instabox.svg',
      logo_png: '/skin/general-images/carrier-logos/instabox.png',
    },
  },
  {
    id: 9,
    name: 'dhlforyou',
    human: 'DHL For You',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/dhlforyou.svg',
      logo_png: '/skin/general-images/carrier-logos/dhlforyou.png',
    },
  },
  {
    id: 10,
    name: 'dhlparcelconnect',
    human: 'DHL Parcel Connect',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/dhlparcelconnect.svg',
      logo_png: '/skin/general-images/carrier-logos/dhlparcelconnect.png',
    },
  },
  {
    id: 11,
    name: 'dhleuroplus',
    human: 'DHL Europlus',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/dhleuroplus.svg',
      logo_png: '/skin/general-images/carrier-logos/dhleuroplus.png',
    },
  },
];

/**
 * @param {Object} args
 * @param {MyParcel.CarrierName} args.carrier
 *
 * @returns {Object[]}
 */
export const fakeCarriersResponse = (args = {}) => {
  if (!args?.carrier) {
    return allCarrierData;
  }

  return allCarrierData.filter(({ name }) => name === args?.carrier);
};
