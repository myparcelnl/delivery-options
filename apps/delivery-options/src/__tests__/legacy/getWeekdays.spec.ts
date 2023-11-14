import {describe, expect, it} from 'vitest';
import {DEFAULT_PLATFORM} from '@myparcel-do/shared';
import {mockConfigBus} from './mockConfigBus';

let configBus;

describe('getWeekdays.js', () => {
  it('creates arrays of weekdays correctly per locale', () => {
    configBus = mockConfigBus(DEFAULT_PLATFORM);
    expect(configBus.get('locale')).toEqual('nl-NL');
    expect(getWeekdays()).toEqual(['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag']);

    configBus.$data.config.locale = 'en-GB';
    expect(getWeekdays()).toEqual(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
  });
});
