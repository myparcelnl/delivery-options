import {waitFor} from '@testing-library/vue';
import {useResolvedDeliveryOptions} from '../../composables';

export const waitForDeliveryOptions = async (): Promise<void> => {
  const options = useResolvedDeliveryOptions();

  await waitFor(() => options.value.length > 0, {timeout: 1000});
};
