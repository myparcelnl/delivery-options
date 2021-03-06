import SettingsForm from '@/sandbox/components/SettingsForm';
import { createSettings } from '@/sandbox/settings/form';
import { platforms } from '@/config/platform/platforms';

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
