import {type LeafletKeyboardEvent, type LeafletMouseEvent} from 'leaflet';
import {type ElementEvent} from '@myparcel-do/shared';

export interface LeafletMapProps {
  center?: [number, number];
  height?: string;
  innerClass?: string | (string | Record<string, string>)[] | Record<string, string>;
  scroll?: boolean | 'center';
  zoom?: number;
}

export interface Marker extends Omit<L.Marker, 'on'> {
  on(event: ElementEvent.Keydown, callback: (event: LeafletKeyboardEvent) => void): void;
  on(event: ElementEvent.Click, callback: (event: LeafletMouseEvent) => void): void;

  on(event: string, callback: (event: L.LeafletEvent) => void): void;
}
