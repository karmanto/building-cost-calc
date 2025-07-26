import { useState, useEffect } from 'react';
import { getCalculatorData } from '@/lib/api';
import {
  CalculatorData,
  RoomDimensions,
} from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ScrollToTopButton from '@/components/ScrollToTopButton'; // Import the new ScrollToTopButton

export default function CalculatorDataShow() {
  const [data, setData] = useState<CalculatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const fetchedData = await getCalculatorData();
      setData(fetchedData);
    } catch (err) {
      console.error('Failed to fetch calculator data:', err);
      setFetchError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-gray-700">Loading data...</p>
      </div>
    );
  }

  if (fetchError && !data) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 text-red-600">
        <p>Error: {fetchError}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-700">
        <p>No calculator data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Card className="max-w-4xl mx-auto shadow-lg rounded-lg">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 text-center"> {/* Adjusted for mobile and added text-center */}
          <div className="flex-1"> {/* Ensure title/description takes available space */}
            <CardTitle className="text-3xl font-bold text-gray-900">Calculator Data Overview</CardTitle>
            <CardDescription className="text-gray-600">
              View the constant values used in the building cost calculation.
            </CardDescription>
          </div>
          <Button onClick={() => navigate('/admin/calculator-data')} className="bg-primary hover:bg-primary-dark text-white w-full sm:w-auto"> {/* Full width on mobile, auto on sm+ */}
            Edit Data
          </Button>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Base Costs */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Base Costs (Rp/m²)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.baseCosts && Object.entries(data.baseCosts).map(([key, value]) => (
                <div key={key} className="space-y-2 p-2 border rounded-md bg-white">
                  <Label className="capitalize text-gray-700">{key}</Label>
                  <p className="text-lg font-medium text-gray-900">{value.toLocaleString('id-ID')}</p>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Material Coefficients */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Material Coefficients</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.materialCoefs && Object.entries(data.materialCoefs).map(([key, value]) => (
                <div key={key} className="space-y-2 p-2 border rounded-md bg-white">
                  <Label className="capitalize text-gray-700">{key}</Label>
                  <p className="text-lg font-medium text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Design Coefficients */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Design Coefficients</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.designCoefs && Object.entries(data.designCoefs).map(([key, value]) => (
                <div key={key} className="space-y-2 p-2 border rounded-md bg-white">
                  <Label className="capitalize text-gray-700">{key}</Label>
                  <p className="text-lg font-medium text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Room Sizes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Room Sizes</h2>
            {data.roomSizes && Object.entries(data.roomSizes).map(([buildingType, categories]) => (
              <div key={buildingType} className="mb-8 p-4 border rounded-lg bg-white shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gray-700 capitalize">{buildingType}</h3>
                {categories && Object.entries(categories as object).map(([category, rooms]) => (
                  <div key={`${buildingType}-${category}`} className="mb-6 p-3 border-l-4 border-primary-500 bg-gray-50 rounded-md">
                    <h4 className="text-lg font-medium mb-3 text-gray-700 capitalize">{category}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {rooms && Object.entries(rooms as object).map(([roomName, dimensionsOrArea]) => {
                        if (typeof dimensionsOrArea === 'object' && dimensionsOrArea !== null) {
                          const dims = dimensionsOrArea as RoomDimensions;
                          return (
                            <div key={`${buildingType}-${category}-${roomName}-dims`} className="space-y-2 p-2 border rounded-md bg-white">
                              <Label className="font-semibold text-gray-800">{roomName}</Label>
                              {dims.pr !== undefined ? (
                                <div>
                                  <Label className="text-sm text-gray-600">Persentase (pr)</Label>
                                  <p className="text-lg font-medium text-gray-900">{dims.pr}</p>
                                </div>
                              ) : (
                                <div className="flex gap-4">
                                  <div>
                                    <Label className="text-sm text-gray-600">Panjang (p)</Label>
                                    <p className="text-lg font-medium text-gray-900">{dims.p}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-gray-600">Lebar (l)</Label>
                                    <p className="text-lg font-medium text-gray-900">{dims.l}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        } else {
                          return (
                            <div key={`${buildingType}-${category}-${roomName}-area`} className="space-y-2 p-2 border rounded-md bg-white">
                              <Label className="font-semibold text-gray-800">{roomName}</Label>
                              <p className="text-lg font-medium text-gray-900">{dimensionsOrArea}</p>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </section>

          <Separator />

          {/* Work Item Percentages */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Work Item Percentages</h2>
            {data.workItemPercentages && Object.entries(data.workItemPercentages).map(([buildingType, categories]) => (
              <div key={buildingType} className="mb-8 p-4 border rounded-lg bg-white shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gray-700 capitalize">{buildingType}</h3>
                {categories && Object.entries(categories as object).map(([category, items]) => (
                  <div key={`${buildingType}-${category}`} className="mb-6 p-3 border-l-4 border-primary-500 bg-gray-50 rounded-md">
                    <h4 className="text-lg font-medium mb-3 text-gray-700 capitalize">{category}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items && Object.entries(items as object).map(([itemName, percentage]) => {
                        return (
                          <div key={`${buildingType}-${category}-${itemName}`} className="space-y-2 p-2 border rounded-md bg-white">
                            <Label className="font-semibold text-gray-800">{itemName}</Label>
                            <p className="text-lg font-medium text-gray-900">{percentage}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </section>
        </CardContent>
      </Card>
      <ScrollToTopButton /> {/* Add the scroll to top button */}
    </div>
  );
}
