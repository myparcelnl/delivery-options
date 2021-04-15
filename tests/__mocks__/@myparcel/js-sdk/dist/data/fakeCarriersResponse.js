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
    id: 5,
    name: 'redjepakketje',
    human: 'Red je Pakketje',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/redjepakketje.svg',
      logo_png: '/skin/general-images/carrier-logos/redjepakketje.png',
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
];

/**
 * @param {Object} args
 * @param {MyParcel.CarrierName} args.carrier
 *
 * @returns {Object[]}
 */
export const fakeCarriersResponse = (args) => {
  return allCarrierData.filter(({ name }) => name === args.carrier);
};
