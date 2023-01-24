import SettingsForm from '../../delivery-options/src/sandbox/components/SettingsForm';
import { createSettings } from '../../delivery-options/src/sandbox/settings/form';
import { platforms } from '../../delivery-options/src/config/platform/platforms';

export default platforms
  .map((platform) => ({
    name: platform,
    label: `platform.${platform}`,
    component: SettingsForm,
    props: {
      platform,
      form: () => createSettings(platform),
    },
  }));
