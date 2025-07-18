import calculatorData from '@/data/calculatorData.json';
import { CalculatorFormValues } from '@/lib/schemas';
import { CalculationResult, CalculatorData } from '@/lib/types'; // Import types

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
    // rooms, // Removed as it's not directly used in calculation
    // bathrooms, // Removed as it's not directly used in calculation
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

  // Use type assertion for calculatorData to resolve TS7053
  const typedCalculatorData = calculatorData as CalculatorData;
  const percentages = typedCalculatorData.roomPercentages[buildingType]?.[category];

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


  const baseCost = typedCalculatorData.baseCosts[buildingType];
  const materialCoef = typedCalculatorData.materialCoefs[material];
  const designCoef = typedCalculatorData.designCoefs[design];

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
    error: null, // Explicitly set error to null on success
  };
}
