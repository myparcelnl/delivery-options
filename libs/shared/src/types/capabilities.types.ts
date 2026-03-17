export interface CapabilityOption {
  requires: string[];
  excludes: string[];
  isSelectedByDefault: boolean;
  isRequired: boolean;
}

export interface CarrierCapability {
  carrier: string;
  packageTypes: string[];
  deliveryTypes: string[];
  options: Record<string, CapabilityOption>;
  transactionTypes?: string[];
  physicalProperties?: Record<string, unknown>;
  collo?: {max: number};
}

export interface CapabilitiesRequestRecipient {
  countryCode: string;
  postalCode?: string;
  isBusiness?: boolean;
}

export interface CapabilitiesRequestSender {
  countryCode?: string;
  postalCode?: string;
  isBusiness?: boolean;
}

export interface CapabilitiesRequestPhysicalProperty {
  value: number;
  unit: string;
}

export interface CapabilitiesRequest {
  recipient: CapabilitiesRequestRecipient;
  sender?: CapabilitiesRequestSender;
  packageType?: string;
  carrier?: string;
  options?: Record<string, Record<string, never>>;
  deliveryType?: string;
  shopId?: number;
  direction?: 'INBOUND' | 'OUTBOUND';
  pickup?: {location?: {type?: 'RETAIL' | 'LOCKER'}};
  physicalProperties?: {
    height?: CapabilitiesRequestPhysicalProperty;
    width?: CapabilitiesRequestPhysicalProperty;
    length?: CapabilitiesRequestPhysicalProperty;
    weight?: CapabilitiesRequestPhysicalProperty;
  };
}

export interface CapabilitiesResponse {
  results: CarrierCapability[];
}
