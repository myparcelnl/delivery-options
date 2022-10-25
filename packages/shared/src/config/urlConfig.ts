import {CarrierName} from '@myparcel/sdk';
import {useAppConfig} from './appConfig';

export const getCarrierLogo = (carrier: CarrierName): string => {
  const appConfig = useAppConfig();
  return `${appConfig.assetsUrl}/skin/general-images/carrier-logos/svg/${carrier}.svg`;
};
