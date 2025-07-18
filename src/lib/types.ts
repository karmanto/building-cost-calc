// src/lib/types.ts

export interface CalculationResult {
  totalCost: number | null;
  totalArea: number | null;
  roomAreaDetails: Record<string, number> | null;
  error: string | null; // Changed to string | null to match App.tsx state
}

export interface RoomPercentages {
  [buildingType: string]: {
    [category: string]: Record<string, number>;
  };
}

export interface CalculatorData {
  roomPercentages: RoomPercentages;
  baseCosts: Record<string, number>;
  materialCoefs: Record<string, number>;
  designCoefs: Record<string, number>;
  buildingTypes: Array<{ value: string; label: string }>;
  materialSpecs: Array<{ value: string; label: string }>;
  designTypes: Array<{ value: string; label: string }>;
  rukoCategories: Array<{ value: string; label: string }>;
}
