export interface Officer {
  policeOfficerID: number;
  latitude: number;
  longitude: number;
  vehicleType?: string;
}

export interface Call {
  callID: number;
  latitude: number;
  longitude: number;
  urgencyLevel: number;
  status: string;
  callTime: string;
  contactPhone?: string;
}

export interface EventZone {
  zoneID: number;
  eventID: number;
  latitude1: number;
  longitude1: number;
  latitude2: number;
  longitude2: number;
  latitude3: number;
  longitude3: number;
  latitude4: number;
  longitude4: number;
}

export interface StrategicZone {
  strategicZoneID: number;
  eventID: number;
  latitude: number;
  longitude: number;
  strategyLevel: number;
}

export interface MapData {
  officers: Officer[];
  calls: Call[];
  eventZones: EventZone[];
  strategicZones: StrategicZone[];
}

export interface MapSettings {
  showOfficers: boolean;
  showCalls: boolean;
  showEventZones: boolean;
  showStrategicZones: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}