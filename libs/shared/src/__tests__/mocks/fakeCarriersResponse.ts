import {type Carrier} from '@myparcel/sdk';
import {CarrierId, CarrierName, type CarrierNameOrId} from '@myparcel/constants';

const allCarrierData: Carrier[] = [
  {
    id: CarrierId.PostNl,
    name: CarrierName.PostNl,
    human: 'PostNL',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/postnl.svg',
      logo_png: '/skin/general-images/carrier-logos/postnl.png',
    },
  },
  {
    id: CarrierId.Bpost,
    name: CarrierName.Bpost,
    human: 'bpost',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/bpost.svg',
      logo_png: '/skin/general-images/carrier-logos/bpost.png',
    },
  },
  {
    id: CarrierId.CheapCargo,
    name: CarrierName.CheapCargo,
    human: 'Cheap Cargo',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/cheapcargo.svg',
      logo_png: '/skin/general-images/carrier-logos/cheapcargo.png',
    },
  },
  {
    id: CarrierId.Dpd,
    name: CarrierName.Dpd,
    human: 'DPD',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/dpd.svg',
      logo_png: '/skin/general-images/carrier-logos/dpd.png',
    },
  },
  {
    id: CarrierId.Dhl,
    name: CarrierName.Dhl,
    human: 'DHL',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/dhl.svg',
      logo_png: '/skin/general-images/carrier-logos/dhl.png',
    },
  },
  {
    id: CarrierId.Ups,
    name: CarrierName.Ups,
    human: 'UPS',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/ups.svg',
      logo_png: '/skin/general-images/carrier-logos/ups.png',
    },
  },
  {
    id: CarrierId.Bol,
    name: CarrierName.Bol,
    human: 'Bol.com',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/bol.com.svg',
      logo_png: '/skin/general-images/carrier-logos/bol.com.png',
    },
  },
  {
    id: CarrierId.Instabox,
    name: CarrierName.Instabox,
    human: 'Instabox',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/instabox.svg',
      logo_png: '/skin/general-images/carrier-logos/instabox.png',
    },
  },
  {
    id: CarrierId.DhlForYou,
    name: CarrierName.DhlForYou,
    human: 'DHL For You',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/dhlforyou.svg',
      logo_png: '/skin/general-images/carrier-logos/dhlforyou.png',
    },
  },
  {
    id: CarrierId.DhlParcelConnect,
    name: CarrierName.DhlParcelConnect,
    human: 'DHL Parcel Connect',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/dhlparcelconnect.svg',
      logo_png: '/skin/general-images/carrier-logos/dhlparcelconnect.png',
    },
  },
  {
    id: CarrierId.DhlEuroPlus,
    name: CarrierName.DhlEuroPlus,
    human: 'DHL Europlus',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/dhleuroplus.svg',
      logo_png: '/skin/general-images/carrier-logos/dhleuroplus.png',
    },
  },
];

export const fakeCarriersResponse = (carrier?: CarrierNameOrId): Carrier[] => {
  if (!carrier) {
    return allCarrierData;
  }

  const found = allCarrierData.find(({name, id}) => name === carrier || id === carrier);

  if (!found) {
    throw new Error(`Carrier ${carrier} not found`);
  }

  return [found];
};
