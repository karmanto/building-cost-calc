// App.tsx
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BuildingCostCalculator from './components/BuildingCostCalculator';
import { Toaster } from '@/components/ui/sonner';
import Login from './pages/Login';
import { setAuthErrorHandler } from './lib/auth';
import CalculatorDataEditor from './pages/admin/CalculatorDataEditor';
import CalculatorDataShow from './pages/admin/CalculatorDataShow';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const navigate = useNavigate();
  const [hasUserProvidedData, setHasUserProvidedData] = useState<boolean>(false);
  const [isLoadingUserCheck, setIsLoadingUserCheck] = useState<boolean>(true);

  useEffect(() => {
    setAuthErrorHandler(() => {
      navigate('/login', { replace: true });
    });

    // Check for user data using the new key
    const userName = localStorage.getItem('calculatorUserName');
    if (userName) {
      setHasUserProvidedData(true);
    }
    setIsLoadingUserCheck(false); 
  }, [navigate]);

  if (isLoadingUserCheck) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Memuat...</p>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-white">
        <main role="main">
          <Routes>
            <Route path="/" element={
              <>
                {/* Always render BuildingCostCalculator, it will handle the UserInputForm internally */}
                <BuildingCostCalculator initialHasUserProvidedData={hasUserProvidedData} />
                <Toaster />
              </>
            } />

            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <CalculatorDataShow />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/calculator-data"
              element={
                <ProtectedRoute>
                  <CalculatorDataEditor />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
  );
}

export default App;
