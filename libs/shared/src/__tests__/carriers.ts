import {type Carrier} from '@myparcel-dev/sdk';
import {CarrierId, CarrierName} from '@myparcel-dev/constants';

export const CARRIER_POST_NL = Object.freeze({
  id: CarrierId.PostNl,
  name: CarrierName.PostNl,
  human: 'PostNL',
  meta: {
    logo_svg: '/skin/general-images/carrier-logos/svg/postnl.svg',
    logo_png: '/skin/general-images/carrier-logos/postnl.png',
  },
}) satisfies Carrier;

export const CARRIER_BPOST = Object.freeze({
  id: CarrierId.Bpost,
  name: CarrierName.Bpost,
  human: 'bpost',
  meta: {
    logo_svg: '/skin/general-images/carrier-logos/svg/bpost.svg',
    logo_png: '/skin/general-images/carrier-logos/bpost.png',
  },
}) satisfies Carrier;

export const CARRIER_CHEAP_CARGO = Object.freeze({
  id: CarrierId.CheapCargo,
  name: CarrierName.CheapCargo,
  human: 'Cheap Cargo',
  meta: {
    logo_svg: '/skin/general-images/carrier-logos/svg/cheapcargo.svg',
    logo_png: '/skin/general-images/carrier-logos/cheapcargo.png',
  },
}) satisfies Carrier;

export const CARRIER_DPD = Object.freeze({
  id: CarrierId.Dpd,
  name: CarrierName.Dpd,
  human: 'DPD',
  meta: {
    logo_svg: '/skin/general-images/carrier-logos/svg/dpd.svg',
    logo_png: '/skin/general-images/carrier-logos/dpd.png',
  },
}) satisfies Carrier;

export const CARRIER_DHL = Object.freeze({
  id: CarrierId.Dhl,
  name: CarrierName.Dhl,
  human: 'DHL',
  meta: {
    logo_svg: '/skin/general-images/carrier-logos/svg/dhl.svg',
    logo_png: '/skin/general-images/carrier-logos/dhl.png',
  },
}) satisfies Carrier;

export const CARRIER_UPS = Object.freeze({
  id: CarrierId.Ups,
  name: CarrierName.Ups,
  human: 'UPS',
  meta: {
    logo_svg: '/skin/general-images/carrier-logos/svg/ups.svg',
    logo_png: '/skin/general-images/carrier-logos/ups.png',
  },
}) satisfies Carrier;

export const CARRIER_UPS_STANDARD = Object.freeze({
  id: CarrierId.UpsStandard,
  name: CarrierName.UpsStandard,
  human: 'UPS Standard',
  meta: {
    logo_svg: '/skin/general-images/carrier-logos/svg/upsstandard.svg',
    logo_png: '/skin/general-images/carrier-logos/upsstandard.png',
  },
}) satisfies Carrier;

export const CARRIER_UPS_EXPRESS_SAVER = Object.freeze({
  id: CarrierId.UpsExpressSaver,
  name: CarrierName.UpsExpressSaver,
  human: 'UPS Express',
  meta: {
    logo_svg: '/skin/general-images/carrier-logos/svg/upsexpresssaver.svg',
    logo_png: '/skin/general-images/carrier-logos/upsexpresssaver.png',
  },
}) satisfies Carrier;

export const CARRIER_BOL = Object.freeze({
  id: CarrierId.Bol,
  name: CarrierName.Bol,
  human: 'Bol.com',
  meta: {
    logo_svg: '/skin/general-images/carrier-logos/svg/bol.com.svg',
    logo_png: '/skin/general-images/carrier-logos/bol.com.png',
  },
}) satisfies Carrier;

export const CARRIER_INSTABOX = Object.freeze({
  id: CarrierId.Instabox,
  name: CarrierName.Instabox,
  human: 'Instabox',
  meta: {
    logo_svg: '/skin/general-images/carrier-logos/svg/instabox.svg',
    logo_png: '/skin/general-images/carrier-logos/instabox.png',
  },
}) satisfies Carrier;

export const CARRIER_DHL_FOR_YOU = Object.freeze({
  id: CarrierId.DhlForYou,
  name: CarrierName.DhlForYou,
  human: 'DHL For You',
  meta: {
    logo_svg: '/skin/general-images/carrier-logos/svg/dhlforyou.svg',
    logo_png: '/skin/general-images/carrier-logos/dhlforyou.png',
  },
}) satisfies Carrier;

export const CARRIER_DHL_PARCEL_CONNECT = Object.freeze({
  id: CarrierId.DhlParcelConnect,
  name: CarrierName.DhlParcelConnect,
  human: 'DHL Parcel Connect',
  meta: {
    logo_svg: '/skin/general-images/carrier-logos/svg/dhlparcelconnect.svg',
    logo_png: '/skin/general-images/carrier-logos/dhlparcelconnect.png',
  },
}) satisfies Carrier;

export const CARRIER_DHL_EURO_PLUS = Object.freeze({
  id: CarrierId.DhlEuroPlus,
  name: CarrierName.DhlEuroPlus,
  human: 'DHL Europlus',
  meta: {
    logo_svg: '/skin/general-images/carrier-logos/svg/dhleuroplus.svg',
    logo_png: '/skin/general-images/carrier-logos/dhleuroplus.png',
  },
}) satisfies Carrier;

export const CARRIER_GLS = Object.freeze({
  id: CarrierId.Gls,
  name: CarrierName.Gls,
  human: 'GLS',
  meta: {
    logo_svg: '/skin/general-images/carrier-logos/svg/gls.svg',
    logo_png: '/skin/general-images/carrier-logos/gls.png',
  },
}) satisfies Carrier;

export const CARRIER_BRT = Object.freeze({
  id: CarrierId.Brt,
  name: CarrierName.Brt,
  human: 'BRT',
  meta: {
    logo_svg: '/skin/general-images/carrier-logos/svg/brt.svg',
    logo_png: '/skin/general-images/carrier-logos/brt.png',
  },
}) satisfies Carrier;

export const CARRIER_TRUNKRS = Object.freeze({
  id: CarrierId.Trunkrs,
  name: CarrierName.Trunkrs,
  human: 'Trunkrs',
  meta: {
    logo_svg: '/skin/general-images/carrier-logos/svg/trunkrs.svg',
    logo_png: '/skin/general-images/carrier-logos/trunkrs.png',
  },
}) satisfies Carrier;
