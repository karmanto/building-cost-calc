import React, { useState } from 'react';
import CalculatorForm from '@/components/CalculatorForm';
import ResultDisplay from '@/components/ResultDisplay';
import { calculateBuildingCost } from '@/lib/calculations';
import { CalculatorFormValues } from '@/lib/schemas';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

function App() {
  const [calculationResult, setCalculationResult] = useState<{
    totalCost: number | null;
    totalArea: number | null;
    roomAreaDetails: Record<string, number> | null;
    error: string | null;
  }>({
    totalCost: null,
    totalArea: null,
    roomAreaDetails: null,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (values: CalculatorFormValues) => {
    setIsLoading(true);
    setCalculationResult({
      totalCost: null,
      totalArea: null,
      roomAreaDetails: null,
      error: null,
    });

    // Simulate a network request or complex calculation
    setTimeout(() => {
      const result = calculateBuildingCost(values);
      if (result.error) {
        setCalculationResult({
          totalCost: null,
          totalArea: null,
          roomAreaDetails: null,
          error: result.error,
        });
        toast({
          title: 'Perhitungan Gagal',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        setCalculationResult(result);
        toast({
          title: 'Perhitungan Berhasil!',
          description: 'Estimasi biaya telah dihitung.',
          variant: 'default',
        });
      }
      setIsLoading(false);
    }, 1000); // Simulate loading time
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <CalculatorForm onSubmit={handleSubmit} isLoading={isLoading} />
      <ResultDisplay
        totalCost={calculationResult.totalCost}
        totalArea={calculationResult.totalArea}
        roomAreaDetails={calculationResult.roomAreaDetails}
        error={calculationResult.error}
      />
      <Toaster />
    </div>
  );
}

export default App;
