import BuildingCostCalculator from './components/BuildingCostCalculator';
import { Toaster } from '@/components/ui/sonner'; // Using sonner for toasts

function App() {
  return (
    <>
      <BuildingCostCalculator />
      <Toaster />
    </>
  );
}

export default App;
