import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Building, Home, Store, Warehouse } from 'lucide-react';

import {
  RoomSizes,
  MaterialCoefs,
  DesignCoefs,
} from '@/lib/types';

import { calculateCost } from '@/lib/api';
import { CalculateCostPayload } from '@/lib/types';

// Import Dialog components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import UserInputForm from './UserInputForm'; // Import UserInputForm

interface BuildingCostCalculatorProps {
  initialHasUserProvidedData: boolean;
}

const BuildingCostCalculator: React.FC<BuildingCostCalculatorProps> = ({ initialHasUserProvidedData }) => {
  const [buildingType, setBuildingType] = useState<keyof RoomSizes>('rumah');
  const [material, setMaterial] = useState<keyof MaterialCoefs>('standar');
  const [design, setDesign] = useState<keyof DesignCoefs>('minimalis');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [floors, setFloors] = useState<string>('');
  const [rooms, setRooms] = useState<string>('');
  const [bathrooms, setBathrooms] = useState<string>('');

  const [isRoomsInputDisabled, setIsRoomsInputDisabled] = useState<boolean>(false);
  const [roomsLabelText, setRoomsLabelText] = useState<string>('Jumlah Kamar:');
  
  // States for results
  const [roomDetailsResult, setRoomDetailsResult] = useState<React.ReactNode | null>(null);
  const [workItemDetailsResult, setWorkItemDetailsResult] = useState<React.ReactNode | null>(null);
  const [totalCostResult, setTotalCostResult] = useState<React.ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  // New states for dialog and result visibility
  const [isFormDialogOpen, setIsFormDialogOpen] = useState<boolean>(false);
  const [hasUserProvidedDataInSession, setHasUserProvidedDataInSession] = useState<boolean>(initialHasUserProvidedData);
  const [showCalculationResults, setShowCalculationResults] = useState<boolean>(false);

  useEffect(() => {
    if (buildingType === 'ruko') {
      setRoomsLabelText('Jumlah Kamar:');
      setIsRoomsInputDisabled(false);
    } else if (buildingType === 'gudang') {
      setRoomsLabelText('Jumlah Ruangan:');
      setIsRoomsInputDisabled(false);
    } else {
      setRoomsLabelText('Jumlah Kamar:');
      setIsRoomsInputDisabled(false);
    }
  }, [buildingType]);

  // Helper function to map room names
  const mapRoomName = (name: string) => {
    switch (name) {
      case 'K Utama': return 'Kamar Utama';
      case 'K Anak': return 'Kamar Anak';
      case 'KM': return 'Kamar Mandi';
      case 'R. Makan': return 'Ruang Makan';
      case 'R Tamu': return 'Ruang Tamu';
      case 'R Keluarga': return 'Ruang Keluarga';
      case 'R Terbuka': return 'Ruang Terbuka';
      case 'R Loundry': return 'Ruang Loundry';
      case 'Sisa R Bebas': return 'Sisa Ruang Bebas';
      default: return name;
    }
  };

  // Function to perform the actual calculation
  const performCalculation = async () => {
    setError(null);
    setRoomDetailsResult(null);
    setWorkItemDetailsResult(null);
    setTotalCostResult(null);
    setShowCalculationResults(false); // Hide previous results

    const parsedLength = parseFloat(length);
    const parsedWidth = parseFloat(width);
    const parsedFloors = parseInt(floors);
    const parsedRooms = parseInt(rooms || '0');
    const parsedBathrooms = parseInt(bathrooms || '0');

    if (isNaN(parsedLength) || isNaN(parsedWidth) || isNaN(parsedFloors) || parsedLength <= 0 || parsedWidth <= 0 || parsedFloors < 1) {
      setError('Masukkan dimensi dan jumlah lantai yang valid.');
      return;
    }
    if (isNaN(parsedRooms) || isNaN(parsedBathrooms) || parsedRooms < 0 || parsedBathrooms < 0) {
      setError('Masukkan jumlah kamar dan kamar mandi yang valid.');
      return;
    }

    try {
      const payload: CalculateCostPayload = {
        buildingType,
        material,
        design,
        length: parsedLength,
        width: parsedWidth,
        floors: parsedFloors,
        rooms: parsedRooms,
        bathrooms: parsedBathrooms,
      };

      const response = await calculateCost(payload);

      const { totalCostResult, roomDetailsResult, workItemDetailsResult } = response;

      setTotalCostResult(
        <div className="text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-primary mb-2 mt-2">Estimasi Biaya Total</h2>
          <p className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">{totalCostResult.formattedCost}</p>
          <p className="text-lg text-muted-foreground">Luas Bangunan: {totalCostResult.totalArea.toFixed(2)} m²</p>
        </div>
      );

      // Helper function to get room display name with count
      const getRoomDisplayString = (item: any, totalRoomsInput: number, totalBathroomsInput: number) => {
        const baseName = mapRoomName(item.roomName); // Use the existing mapping
        let countSuffix = '';

        switch (item.roomName) { // Use original roomName for logic
          case 'K Utama':
            countSuffix = `(${totalRoomsInput > 0 ? 1 : 0} ruangan)`;
            break;
          case 'Ruangan':
            countSuffix = `(${totalRoomsInput ?? 0} ruangan)`;
            break;
          case 'K Anak':
            const anakRoomsCount = Math.max(0, totalRoomsInput - 1);
            countSuffix = `(${anakRoomsCount} ruangan)`;
            break;
          case 'KM':
            countSuffix = `(${totalBathroomsInput} ruangan)`;
            break;
          case 'R. Makan':
          case 'R Tamu':
          case 'R Keluarga':
          case 'R Terbuka':
          case 'Sisa R Bebas':
          case 'Dapur':
          case 'Gudang':
          case 'R Loundry':
            countSuffix = '(1 ruangan)';
            break;
          default:
            countSuffix = '(0 ruangan)'; 
            break;
        }

        if (item.calculatedArea > 0) {
          return `${baseName} ${countSuffix}`;
        } else {
          return <span className="text-muted-foreground italic">{`${baseName} ${countSuffix}`}</span>;
        }
      };

      setRoomDetailsResult(
        <>
          <h3 className="text-xl font-semibold text-foreground mb-4 text-center mt-2">Detail Luas Ruang</h3>
          <Table className="w-full text-left rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow className="bg-secondary">
                <TableHead className="px-4 py-3 text-muted-foreground">Ruangan</TableHead>
                <TableHead className="px-4 py-3 text-muted-foreground text-right">Luas (m²)</TableHead>
                <TableHead className="px-4 py-3 text-muted-foreground">Rekomendasi Ukuran (Per Ruangan)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-card">
              {roomDetailsResult.map((item: any, index: number) => (
                <TableRow key={index} className="border-b border-border hover:bg-secondary transition-colors">
                  <TableCell className="px-4 py-2 text-foreground">
                    {getRoomDisplayString(item, parsedRooms, parsedBathrooms)}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-foreground text-right">{item.calculatedArea.toFixed(2)}</TableCell>
                  <TableCell className="px-4 py-2 text-foreground">{item.recommendedSize}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      );

      setWorkItemDetailsResult(
        <>
          <h3 className="text-xl font-semibold text-foreground mb-4 text-center mt-2">Rincian Biaya per Item Pekerjaan</h3>
          <Table className="w-full text-left rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow className="bg-secondary">
                <TableHead className="px-4 py-3 text-muted-foreground">Item Pekerjaan</TableHead>
                <TableHead className="px-4 py-3 text-muted-foreground text-right">Biaya (Rp)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-card">
              {workItemDetailsResult.map((item: any, index: number) => (
                <TableRow key={index} className="border-b border-border hover:bg-secondary transition-colors">
                  <TableCell className="px-4 py-2 text-foreground">{item.name}</TableCell>
                  <TableCell className="px-4 py-2 text-foreground text-right">{Math.round(item.cost).toLocaleString('id-ID')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      );
      setShowCalculationResults(true); // Show results only after successful calculation
    } catch (err: any) {
      console.error('Error calculating cost:', err);
      setError(err.message || 'Terjadi kesalahan saat menghitung biaya. Silakan coba lagi.');
      setShowCalculationResults(false); // Ensure results are hidden on error
    }
  };

  const handleCalculateCost = async () => {
    if (!hasUserProvidedDataInSession) {
      setIsFormDialogOpen(true); // Open the form dialog if user data is not provided
      return; // Stop here, calculation will be triggered after form submission
    }
    // If user data is already provided, proceed with calculation
    performCalculation();
  };

  const handleUserInputSuccess = (name: string) => { // Changed parameter to name
    localStorage.setItem('calculatorUserName', name); // Persist name to localStorage
    setHasUserProvidedDataInSession(true); // Mark user data as provided for the session
    setIsFormDialogOpen(false); // Close the dialog
    performCalculation(); // Re-trigger calculation now that user data is available
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-4xl bg-card shadow-md border-border rounded-xl p-2 md:p-8 animate-fade-in">
        <CardHeader className="text-center mb-8">
          <CardTitle className="text-4xl font-extrabold text-foreground mb-2 flex items-center justify-center gap-3">
            Kalkulator Biaya Bangunan
          </CardTitle>
          <CardDescription className="text-muted-foreground text-lg">
            Estimasi biaya pembangunan impian Anda dengan mudah dan akurat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <Label htmlFor="buildingType" className="text-foreground">Jenis Bangunan:</Label>
              <Select value={buildingType} onValueChange={(value) => setBuildingType(value as keyof RoomSizes)}>
                <SelectTrigger className="w-full bg-background border-border text-foreground rounded-lg focus:ring-primary">
                  <SelectValue placeholder="Pilih Jenis Bangunan" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-lg">
                  <SelectItem value="rumah" className="hover:bg-secondary focus:bg-secondary rounded-md">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4" /> Rumah
                    </div>
                  </SelectItem>
                  <SelectItem value="kos" className="hover:bg-secondary focus:bg-secondary rounded-md">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" /> Kos
                    </div>
                  </SelectItem>
                  <SelectItem value="ruko" className="hover:bg-secondary focus:bg-secondary rounded-md">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4" /> Ruko
                    </div>
                  </SelectItem>
                  <SelectItem value="gudang" className="hover:bg-secondary focus:bg-secondary rounded-md">
                    <div className="flex items-center gap-2">
                      <Warehouse className="h-4 w-4" /> Gudang
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material" className="text-foreground">Spesifikasi Material:</Label>
              <Select value={material} onValueChange={(value) => setMaterial(value as keyof MaterialCoefs)}>
                <SelectTrigger className="w-full bg-background border-border text-foreground rounded-lg focus:ring-primary">
                  <SelectValue placeholder="Pilih Spesifikasi Material" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-lg">
                  <SelectItem value="standar" className="hover:bg-secondary focus:bg-secondary rounded-md">Standar</SelectItem>
                  <SelectItem value="menengah" className="hover:bg-secondary focus:bg-secondary rounded-md">Menengah</SelectItem>
                  <SelectItem value="mewah" className="hover:bg-secondary focus:bg-secondary rounded-md">Mewah</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="design" className="text-foreground">Desain Bangunan:</Label>
              <Select value={design} onValueChange={(value) => setDesign(value as keyof DesignCoefs)}>
                <SelectTrigger className="w-full bg-background border-border text-foreground rounded-lg focus:ring-primary">
                  <SelectValue placeholder="Pilih Desain Bangunan" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-lg">
                  <SelectItem value="minimalis" className="hover:bg-secondary focus:bg-secondary rounded-md">Minimalis</SelectItem>
                  <SelectItem value="skandinavia" className="hover:bg-secondary focus:bg-secondary rounded-md">Skandinavia</SelectItem>
                  <SelectItem value="tropis" className="hover:bg-secondary focus:bg-secondary rounded-md">Tropis</SelectItem>
                  <SelectItem value="modern" className="hover:bg-secondary focus:bg-secondary rounded-md">Modern</SelectItem>
                  <SelectItem value="klasik" className="hover:bg-secondary focus:bg-secondary rounded-md">Klasik</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="length" className="text-foreground">Panjang (m):</Label>
              <Input
                id="length"
                type="number"
                min="0"
                step="0.01"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                required
                className="bg-background border-border text-foreground rounded-lg focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="width" className="text-foreground">Lebar (m):</Label>
              <Input
                id="width"
                type="number"
                min="0"
                step="0.01"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                required
                className="bg-background border-border text-foreground rounded-lg focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floors" className="text-foreground">Jumlah Lantai:</Label>
              <Input
                id="floors"
                type="number"
                min="1"
                value={floors}
                onChange={(e) => setFloors(e.target.value)}
                required
                className="bg-background border-border text-foreground rounded-lg focus:ring-primary"
              />
            </div>

            <div id="roomInputs" className="space-y-2">
              <Label htmlFor="rooms" className="text-foreground">{roomsLabelText}</Label>
              <Input
                id="rooms"
                type="number"
                min="0"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                disabled={isRoomsInputDisabled}
                className="bg-background border-border text-foreground rounded-lg focus:ring-primary disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms" className="text-foreground">Jumlah Kamar Mandi:</Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="bg-background border-border text-foreground rounded-lg focus:ring-primary"
              />
            </div>
          </div>

          <Button
            onClick={handleCalculateCost}
            className="w-full py-3 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Hitung Biaya
          </Button>

          {error && (
            <div className="mt-8 p-4 bg-error/20 text-error border border-error rounded-lg animate-fade-in">
              <p className="font-medium">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conditional rendering of results */}
      {showCalculationResults && roomDetailsResult && (
        <Card className="w-full max-w-4xl bg-card shadow-lg border-border rounded-xl p-2 md:p-8 mt-8 animate-fade-in-up">
          <CardContent className="p-0">
            {roomDetailsResult}
          </CardContent>
        </Card>
      )}

      {showCalculationResults && workItemDetailsResult && (
        <Card className="w-full max-w-4xl bg-card shadow-lg border-border rounded-xl p-2 md:p-8 mt-8 animate-fade-in-up">
          <CardContent className="p-0">
            {workItemDetailsResult}
          </CardContent>
        </Card>
      )}

      {showCalculationResults && totalCostResult && (
        <Card className="w-full max-w-4xl bg-card shadow-lg border-primary/50 rounded-xl p-2 md:p-8 mt-8 animate-fade-in-up">
          <CardContent className="p-0">
            {totalCostResult}
          </CardContent>
        </Card>
      )}

      {/* User Input Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">Informasi Pengguna</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Mohon lengkapi data Anda untuk melanjutkan perhitungan.
            </DialogDescription>
          </DialogHeader>
          <UserInputForm onSuccess={handleUserInputSuccess} onClose={() => setIsFormDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuildingCostCalculator;
