import {platforms} from '@myparcel-do/shared';

export default platforms.map((platform) => ({
  name: platform,
  label: `platform.${platform}`,
  component: SettingsForm,
  props: {
    platform,
    form: () => createSettings(platform),
  },
}));
