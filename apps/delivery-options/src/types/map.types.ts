export interface LeafletMapProps {
  center?: [number, number];
  height?: string;
  innerClass?: string | (string | Record<string, string>)[] | Record<string, string>;
  scroll?: boolean | 'center';
  zoom?: number;
}
