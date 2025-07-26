import React, { useState, useEffect, useCallback } from 'react';
import { getCalculatorData, updateCalculatorData } from '@/lib/api';
import {
  CalculatorData,
  RoomDimensions,
} from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScrollToBottomButton from '@/components/ScrollToBottomButton'; // Import the new component

// Helper type for field errors
type FieldErrors = Record<string, string | null>;

export default function CalculatorDataEditor() {
  const [data, setData] = useState<CalculatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null); // Error from initial fetch
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
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
      toast.error('Failed to load calculator data.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = useCallback((path: string, value: any) => {
    setData(prevData => {
      if (!prevData) return null;
      const newData = { ...prevData };
      let current: any = newData;
      const pathParts = path.split('.');

      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (Array.isArray(current)) {
          const index = parseInt(part, 10);
          current = current[index];
        } else {
          current = current[part];
        }
        if (!current) return prevData; // Should not happen if path is valid
      }

      const lastPart = pathParts[pathParts.length - 1];
      if (Array.isArray(current)) {
        const index = parseInt(lastPart, 10);
        current[index] = value;
      } else {
        current[lastPart] = value;
      }
      return newData;
    });
  }, []);

  const handleNumericInputChange = useCallback((path: string, value: string) => {
    const numValue = parseFloat(value);
    if (value === '' || !isNaN(numValue)) {
      updateField(path, value === '' ? 0 : numValue); // Store 0 for empty string, or actual number
      setFieldErrors(prev => ({ ...prev, [path]: null }));
    } else {
      setFieldErrors(prev => ({ ...prev, [path]: 'Must be a valid number' }));
    }
  }, [updateField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data) {
      toast.error('No data to save.');
      return;
    }

    if (Object.values(fieldErrors).some(error => error !== null)) {
      toast.error('Please correct the errors before saving.');
      return;
    }

    setIsSaving(true);
    try {
      // CRITICAL FIX: Wrap the data in a 'data' object as required by the Laravel backend
      await updateCalculatorData({ data: data });
      toast.success('Calculator data updated successfully!');
      navigate('/admin'); // Redirect to show page after successful save
    } catch (err) {
      console.error('Failed to update calculator data:', err);
      toast.error(`Failed to update data: ${err instanceof Error ? err.message : 'An unknown error occurred.'}`);
    } finally {
      setIsSaving(false);
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
        <CardHeader className="text-center"> {/* Added text-center */}
          <CardTitle className="text-3xl font-bold text-gray-900">Edit Calculator Data</CardTitle>
          <CardDescription className="text-gray-600">
            Manage the constant values used in the building cost calculation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Base Costs */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Base Costs (Rp/m²)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.baseCosts && Object.entries(data.baseCosts).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`baseCost-${key}`} className="capitalize">{key}</Label>
                    <Input
                      id={`baseCost-${key}`}
                      type="number"
                      value={value}
                      onChange={(e) => handleNumericInputChange(`baseCosts.${key}`, e.target.value)}
                      step="0.001"
                      className="border-gray-300 focus:border-primary focus:ring-primary"
                    />
                    {fieldErrors[`baseCosts.${key}`] && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors[`baseCosts.${key}`]}</p>
                    )}
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
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`materialCoef-${key}`} className="capitalize">{key}</Label>
                    <Input
                      id={`materialCoef-${key}`}
                      type="number"
                      value={value}
                      onChange={(e) => handleNumericInputChange(`materialCoefs.${key}`, e.target.value)}
                      step="0.001"
                      className="border-gray-300 focus:border-primary focus:ring-primary"
                    />
                    {fieldErrors[`materialCoefs.${key}`] && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors[`materialCoefs.${key}`]}</p>
                    )}
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
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`designCoef-${key}`} className="capitalize">{key}</Label>
                    <Input
                      id={`designCoef-${key}`}
                      type="number"
                      value={value}
                      onChange={(e) => handleNumericInputChange(`designCoefs.${key}`, e.target.value)}
                      step="0.001"
                      className="border-gray-300 focus:border-primary focus:ring-primary"
                    />
                    {fieldErrors[`designCoefs.${key}`] && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors[`designCoefs.${key}`]}</p>
                    )}
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
                          const pathPrefix = `roomSizes.${buildingType}.${category}.${roomName}`;
                          if (typeof dimensionsOrArea === 'object' && dimensionsOrArea !== null) {
                            const dims = dimensionsOrArea as RoomDimensions;
                            return (
                              <div key={`${pathPrefix}-dims`} className="space-y-2 p-2 border rounded-md bg-white">
                                <Label className="font-semibold text-gray-800">{roomName}</Label>
                                {dims.pr !== undefined ? (
                                  // Render for 'pr' (percentage)
                                  <div className="flex-1">
                                    <Label htmlFor={`${pathPrefix}-pr`} className="text-sm">Persentase (pr)</Label>
                                    <Input
                                      id={`${pathPrefix}-pr`}
                                      type="number"
                                      value={dims.pr === undefined ? '' : dims.pr}
                                      onChange={(e) => handleNumericInputChange(`${pathPrefix}.pr`, e.target.value)}
                                      step="0.001"
                                      min="0"
                                      max="1"
                                      className="border-gray-300 focus:border-primary focus:ring-primary"
                                    />
                                    {fieldErrors[`${pathPrefix}.pr`] && (
                                      <p className="text-red-500 text-sm mt-1">{fieldErrors[`${pathPrefix}.pr`]}</p>
                                    )}
                                  </div>
                                ) : (
                                  // Render for 'p' and 'l' (dimensions)
                                  <div className="flex gap-2">
                                    <div className="flex-1">
                                      <Label htmlFor={`${pathPrefix}-p`} className="text-sm">Panjang (p)</Label>
                                      <Input
                                        id={`${pathPrefix}-p`}
                                        type="number"
                                        value={dims.p === undefined ? '' : dims.p}
                                        onChange={(e) => handleNumericInputChange(`${pathPrefix}.p`, e.target.value)}
                                        step="0.001"
                                        className="border-gray-300 focus:border-primary focus:ring-primary"
                                      />
                                      {fieldErrors[`${pathPrefix}.p`] && (
                                        <p className="text-red-500 text-sm mt-1">{fieldErrors[`${pathPrefix}.p`]}</p>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <Label htmlFor={`${pathPrefix}-l`} className="text-sm">Lebar (l)</Label>
                                      <Input
                                        id={`${pathPrefix}-l`}
                                        type="number"
                                        value={dims.l === undefined ? '' : dims.l}
                                        onChange={(e) => handleNumericInputChange(`${pathPrefix}.l`, e.target.value)}
                                        step="0.001"
                                        className="border-gray-300 focus:border-primary focus:ring-primary"
                                      />
                                      {fieldErrors[`${pathPrefix}.l`] && (
                                        <p className="text-red-500 text-sm mt-1">{fieldErrors[`${pathPrefix}.l`]}</p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          } else {
                            // It's a number (e.g., Sisa R Bebas)
                            return (
                              <div key={`${pathPrefix}-area`} className="space-y-2 p-2 border rounded-md bg-white">
                                <Label htmlFor={`${pathPrefix}`} className="font-semibold text-gray-800">{roomName}</Label>
                                <Input
                                  id={`${pathPrefix}`}
                                  type="number"
                                  value={dimensionsOrArea === undefined ? '' : dimensionsOrArea}
                                  onChange={(e) => handleNumericInputChange(pathPrefix, e.target.value)}
                                  step="0.001"
                                  className="border-gray-300 focus:border-primary focus:ring-primary"
                                />
                                {fieldErrors[pathPrefix] && (
                                  <p className="text-red-500 text-sm mt-1">{fieldErrors[pathPrefix]}</p>
                                )}
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
                          const path = `workItemPercentages.${buildingType}.${category}.${itemName}`;
                          return (
                            <div key={path} className="space-y-2 p-2 border rounded-md bg-white">
                              <Label htmlFor={path} className="font-semibold text-gray-800">{itemName}</Label>
                              <Input
                                id={path}
                                type="number"
                                value={percentage === undefined ? '' : percentage}
                                onChange={(e) => handleNumericInputChange(path, e.target.value)}
                                step="0.001"
                                min="0"
                                max="1"
                                className="border-gray-300 focus:border-primary focus:ring-primary"
                              />
                              {fieldErrors[path] && (
                                <p className="text-red-500 text-sm mt-1">{fieldErrors[path]}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </section>

            <CardFooter className="flex justify-end p-0 pt-6">
              <Button type="submit" disabled={isSaving || Object.values(fieldErrors).some(error => error !== null)} className="w-full sm:w-auto">
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      <ScrollToBottomButton /> {/* Add the scroll to bottom button */}
    </div>
  );
}
