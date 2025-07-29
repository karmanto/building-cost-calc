export interface CalculateCostPayload {
  buildingType: string;
  material: string;
  design: string;
  length: number;
  width: number;
  floors: number;
  rooms: number;
  bathrooms: number;
}

export interface RoomDetail {
  roomName: string;
  calculatedArea: number;
  recommendedSize: string;
}

export interface WorkItemDetail {
  name: string;
  cost: number;
}

export interface TotalCostResult {
  formattedCost: string;
  totalArea: number;
}

export interface CalculateCostResponse {
  totalCostResult: TotalCostResult;
  roomDetailsResult: RoomDetail[];
  workItemDetailsResult: WorkItemDetail[];
}

export interface RoomDimensions {
  p?: number; // Panjang
  l?: number; // Lebar
  pr?: number; // Percentage for open rooms (e.g., R Terbuka)
}

export interface RumahRoomSizes {
  'K Utama'?: RoomDimensions;
  'K Anak'?: RoomDimensions;
  'KM'?: RoomDimensions;
  'R. Makan'?: RoomDimensions;
  'Dapur'?: RoomDimensions;
  'R Tamu'?: RoomDimensions;
  'R Keluarga'?: RoomDimensions;
  'R Terbuka'?: RoomDimensions; // Updated to RoomDimensions
  'Sisa R Bebas'?: number;
}

export interface KosRoomSizes {
  'K Utama'?: RoomDimensions;
  'Gudang'?: RoomDimensions;
  'KM'?: RoomDimensions;
  'R. Makan'?: RoomDimensions;
  'Dapur'?: RoomDimensions;
  'R Tamu'?: RoomDimensions;
  'R Loundry'?: RoomDimensions;
  'R Terbuka'?: RoomDimensions; // Updated to RoomDimensions
  'Sisa R Bebas'?: number;
}

export interface RukoRoomSizes {
  'K Utama'?: RoomDimensions;
  'K Anak'?: RoomDimensions;
  'KM'?: RoomDimensions;
  'R. Makan'?: RoomDimensions;
  'Dapur'?: RoomDimensions;
  'R Tamu'?: RoomDimensions;
  'R Keluarga'?: RoomDimensions;
  'R Terbuka'?: RoomDimensions; // Updated to RoomDimensions
  'Sisa R Bebas'?: number;
}

export interface GudangRoomSizes {
  'Ruangan'?: RoomDimensions;
  'KM'?: RoomDimensions;
  'R Terbuka'?: RoomDimensions; // Updated to RoomDimensions
  'Sisa R Bebas'?: number;
}

export interface RoomSizes {
  'rumah': {
    '<100': RumahRoomSizes;
    '>100': RumahRoomSizes;
    '>200': RumahRoomSizes;
  };
  'kos': {
    'eksekutif': KosRoomSizes;
    'ekonomi': KosRoomSizes;
  };
  'ruko': {
    'siap huni': RukoRoomSizes;
    'kosong': RukoRoomSizes;
  };
  'gudang': {
    'kosong': GudangRoomSizes;
  };
}

export interface WorkItemPercentagesMap { [key: string]: number; }

export interface WorkItemPercentages {
  'rumah': {
    '<100': WorkItemPercentagesMap;
    '>100': WorkItemPercentagesMap;
    '>200': WorkItemPercentagesMap;
  };
  'kos': {
    'eksekutif': WorkItemPercentagesMap;
    'ekonomi': WorkItemPercentagesMap;
  };
  'ruko': {
    'siap huni': WorkItemPercentagesMap;
    'kosong': WorkItemPercentagesMap;
  };
  'gudang': {
    'kosong': WorkItemPercentagesMap;
  };
}

export interface BaseCosts {
  'rumah': number;
  'kos': number;
  'ruko': number;
  'gudang': number;
}

export interface MaterialCoefs {
  'standar': number;
  'menengah': number;
  'mewah': number;
}

export interface DesignCoefs {
  'minimalis': number;
  'skandinavia': number;
  'tropis': number;
  'modern': number;
  'klasik': number;
}

export interface CalculatorData {
  roomSizes: RoomSizes;
  workItemPercentages: WorkItemPercentages;
  baseCosts: BaseCosts;
  materialCoefs: MaterialCoefs;
  designCoefs: DesignCoefs;
}

export interface UpdateCalculatorPayload {
  data: CalculatorData;
}

export interface CalculatorUserPayload {
  name: string;
  whatsapp_number: string;
  domisili: string;
}

export interface CalculatorUser {
  id: number;
  name: string;
  whatsapp_number: string;
  domisili: string;
  created_at: string;
  updated_at: string;
}

export interface SaveCalculatorUserResponse {
  message: string;
  user: CalculatorUser;
}

export interface CheckCalculatorUserResponse {
  exists: boolean;
  user: CalculatorUser | null;
}
