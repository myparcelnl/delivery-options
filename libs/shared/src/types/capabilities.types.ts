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

export interface CapabilitiesRequest {
  recipient: {countryCode: string};
  packageType?: string;
}

export interface CapabilitiesResponse {
  results: CarrierCapability[];
}
