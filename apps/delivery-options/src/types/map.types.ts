import type {Marker} from 'leaflet';

export interface LeafletMapProps {
  center?: [number, number];
  height?: string;
  innerClass?: string | (string | Record<string, string>)[] | Record<string, string>;
  scroll?: boolean | 'center';
  zoom?: number;
}

export interface MapMarker extends Marker {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _leaflet_id: number;
}

export type LatLng = undefined | [number, number];
