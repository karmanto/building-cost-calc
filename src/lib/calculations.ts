import calculatorData from '@/data/calculatorData.json';
import { CalculatorFormValues } from '@/lib/schemas';

interface CalculationResult {
  totalCost: number;
  totalArea: number;
  roomAreaDetails: Record<string, number>;
  error?: string;
}

export function calculateBuildingCost(
  values: CalculatorFormValues
): CalculationResult {
  const {
    buildingType,
    material,
    design,
    length,
    width,
    floors,
    rooms, // Not directly used in calculation, but kept for potential future use or display
    bathrooms, // Not directly used in calculation, but kept for potential future use or display
    rukoType,
  } = values;

  const totalArea = length * width * floors;

  let category: string;
  if (buildingType === 'rumah') {
    const landArea = length * width;
    if (landArea < 100) category = 'lessThan100';
    else if (landArea <= 200) category = 'between100And200';
    else category = 'greaterThan200';
  } else if (buildingType === 'kos') {
    category = material === 'standar' ? 'ekonomi' : 'eksekutif';
  } else if (buildingType === 'ruko') {
    category = rukoType || 'kosong'; // Default to 'kosong' if rukoType is not set
  } else if (buildingType === 'gudang') {
    category = 'kosong';
  } else {
    return {
      totalCost: 0,
      totalArea: 0,
      roomAreaDetails: {},
      error: 'Jenis bangunan tidak valid.',
    };
  }

  const percentages = calculatorData.roomPercentages[buildingType]?.[category];

  if (!percentages) {
    return {
      totalCost: 0,
      totalArea: 0,
      roomAreaDetails: {},
      error: 'Data persentase ruangan tidak ditemukan untuk kombinasi ini.',
    };
  }

  const roomAreas: Record<string, number> = {};
  let totalAllocated = 0;
  for (const room in percentages) {
    if (room !== 'Sisa Ruang Bebas') {
      roomAreas[room] = totalArea * percentages[room];
      totalAllocated += roomAreas[room];
    }
  }
  const sisaRuangBebas = totalArea - totalAllocated;

  if (sisaRuangBebas < 0) {
    return {
      totalCost: 0,
      totalArea: 0,
      roomAreaDetails: {},
      error: 'Error: Ukuran bangunan kurang. Sisa ruang bebas negatif.',
    };
  }
  roomAreas['Sisa Ruang Bebas'] = sisaRuangBebas;


  const baseCost = calculatorData.baseCosts[buildingType];
  const materialCoef = calculatorData.materialCoefs[material];
  const designCoef = calculatorData.designCoefs[design];

  if (!baseCost || !materialCoef || !designCoef) {
    return {
      totalCost: 0,
      totalArea: 0,
      roomAreaDetails: {},
      error: 'Data biaya dasar, material, atau desain tidak ditemukan.',
    };
  }

  const totalCost = baseCost * materialCoef * designCoef * totalArea;

  return {
    totalCost,
    totalArea,
    roomAreaDetails: roomAreas,
  };
}
