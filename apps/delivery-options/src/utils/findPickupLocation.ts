import {type ResolvedPickupLocation} from '../types';
import {useResolvedPickupLocations} from '../composables';

export const findPickupLocation = (locationCode: string | undefined): ResolvedPickupLocation | undefined => {
  const locations = useResolvedPickupLocations();

  return (locations.value ?? []).find(({location}) => location.location_code === locationCode);
};
