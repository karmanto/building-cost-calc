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
import { Building, Home, Store, Warehouse } from 'lucide-react'; // Icons for building types

import {
  roomSizes,
  workItemPercentages,
  baseCosts,
  materialCoefs,
  designCoefs,
  RoomSizes, // Import the new types
  WorkItemPercentages, // Import the new types
  RoomDimensions,
  RumahRoomSizes,
  KosRoomSizes,
  RukoRoomSizes,
  GudangRoomSizes,
  WorkItemPercentagesMap
} from '@/constants/calculatorData';

const BuildingCostCalculator: React.FC = () => {
  const [buildingType, setBuildingType] = useState<keyof RoomSizes>('rumah'); // Use keyof RoomSizes
  const [material, setMaterial] = useState<keyof typeof materialCoefs>('standar');
  const [design, setDesign] = useState<keyof typeof designCoefs>('minimalis');
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [floors, setFloors] = useState<number>(1);
  const [rukoType, setRukoType] = useState<keyof RoomSizes['ruko']>('siap huni'); // Use keyof RoomSizes['ruko']
  const [rooms, setRooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);

  const [showRukoCategory, setShowRukoCategory] = useState<boolean>(false);
  const [isRoomsInputDisabled, setIsRoomsInputDisabled] = useState<boolean>(false);
  const [roomsLabelText, setRoomsLabelText] = useState<string>('Jumlah Kamar/Ruangan:');
  const [result, setResult] = useState<React.ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Effect to adjust inputs based on building type
  useEffect(() => {
    setShowRukoCategory(buildingType === 'ruko');
    if (buildingType === 'ruko') {
      setRoomsLabelText('Jumlah Kamar:');
      setIsRoomsInputDisabled(rukoType === 'kosong');
      if (rukoType === 'kosong') setRooms(0);
    } else if (buildingType === 'gudang') {
      setRoomsLabelText('Jumlah Ruangan:');
      setIsRoomsInputDisabled(false); // Gudang always has rooms input enabled
    } else {
      setRoomsLabelText('Jumlah Kamar:');
      setIsRoomsInputDisabled(false);
    }
  }, [buildingType, rukoType]);

  const handleCalculateCost = () => {
    setError(null);
    setResult(null);

    if (isNaN(length) || isNaN(width) || isNaN(floors) || length <= 0 || width <= 0 || floors < 1) {
      setError('Masukkan dimensi dan jumlah lantai yang valid.');
      return;
    }
    if (isNaN(rooms) || isNaN(bathrooms) || rooms < 0 || bathrooms < 0) {
      setError('Masukkan jumlah kamar dan kamar mandi yang valid.');
      return;
    }

    const landArea = length * width;
    const totalArea = landArea * floors;

    // Declare category without initial empty string
    let category: keyof RoomSizes['rumah'] | keyof RoomSizes['kos'] | keyof RoomSizes['ruko'] | keyof RoomSizes['gudang'];

    // Determine category based on building type and other factors
    if (buildingType === 'rumah') {
      if (landArea <= 100) category = '<100';
      else if (landArea <= 200) category = '>100';
      else category = '>200';
    } else if (buildingType === 'kos') {
      category = (material === 'standar') ? 'ekonomi' : 'eksekutif';
    } else if (buildingType === 'ruko') {
      category = rukoType;
    } else if (buildingType === 'gudang') {
      category = 'kosong';
    } else {
      setError('Jenis bangunan tidak valid.');
      return;
    }

    let sizes: RumahRoomSizes | KosRoomSizes | RukoRoomSizes | GudangRoomSizes;

    // Narrowing types for roomSizes based on buildingType
    if (buildingType === 'rumah') {
      sizes = roomSizes.rumah[category as keyof RoomSizes['rumah']];
    } else if (buildingType === 'kos') {
      sizes = roomSizes.kos[category as keyof RoomSizes['kos']];
    } else if (buildingType === 'ruko') {
      sizes = roomSizes.ruko[category as keyof RoomSizes['ruko']];
    } else if (buildingType === 'gudang') {
      sizes = roomSizes.gudang[category as keyof RoomSizes['gudang']];
    } else {
      setError('Jenis bangunan tidak valid.');
      return;
    }

    if (!sizes) {
      setError('Konfigurasi ukuran ruangan tidak ditemukan untuk pilihan ini.');
      return;
    }

    const roomAreas: { [key: string]: number } = {};
    let totalCalculatedArea = 0;

    // Helper function to get area safely
    const getArea = (dim?: RoomDimensions) => (dim?.p || 0) * (dim?.l || 0);

    if (buildingType === 'rumah') {
      const s = sizes as RumahRoomSizes; // Cast to specific type
      roomAreas['K Utama'] = getArea(s['K Utama']) * 1;
      roomAreas['K Anak'] = getArea(s['K Anak']) * (rooms > 0 ? rooms - 1 : 0);
      roomAreas['KM'] = getArea(s['KM']) * bathrooms;
      roomAreas['R. Makan'] = getArea(s['R. Makan']) * 1;
      roomAreas['Dapur'] = getArea(s['Dapur']) * 1;
      roomAreas['R Tamu'] = getArea(s['R Tamu']) * 1;
      roomAreas['R Keluarga'] = getArea(s['R Keluarga']) * 1;
      roomAreas['R Terbuka'] = landArea * 0.25;
    } else if (buildingType === 'kos') {
      const s = sizes as KosRoomSizes; // Cast to specific type
      roomAreas['K Utama'] = getArea(s['K Utama']) * 1;
      roomAreas['Gudang'] = getArea(s['Gudang']) * 1;
      roomAreas['KM'] = getArea(s['KM']) * bathrooms;
      roomAreas['R. Makan'] = getArea(s['R. Makan']) * 1;
      roomAreas['Dapur'] = getArea(s['Dapur']) * 1;
      roomAreas['R Tamu'] = getArea(s['R Tamu']) * 1;
      roomAreas['R Loundry'] = getArea(s['R Loundry']) * 1;
      roomAreas['R Terbuka'] = landArea * 0.25;
    } else if (buildingType === 'ruko' && category === 'siap huni') {
      const s = sizes as RukoRoomSizes; // Cast to specific type
      roomAreas['K Utama'] = getArea(s['K Utama']) * 1;
      roomAreas['K Anak'] = getArea(s['K Anak']) * (rooms > 0 ? rooms - 1 : 0);
      roomAreas['KM'] = getArea(s['KM']) * bathrooms;
      roomAreas['R. Makan'] = getArea(s['R. Makan']) * 1;
      roomAreas['Dapur'] = getArea(s['Dapur']) * 1;
      roomAreas['R Tamu'] = getArea(s['R Tamu']) * 1;
      roomAreas['R Keluarga'] = getArea(s['R Keluarga']) * 1;
      roomAreas['R Terbuka'] = totalArea - (Object.values(roomAreas).reduce((sum, val) => sum + val, 0)); // Calculate remaining area
    } else if (buildingType === 'ruko' && category === 'kosong') {
      const s = sizes as RukoRoomSizes; // Cast to specific type
      roomAreas['KM'] = getArea(s['KM']) * bathrooms;
      roomAreas['R Terbuka'] = totalArea - (roomAreas['KM'] || 0);
    } else if (buildingType === 'gudang') {
      const s = sizes as GudangRoomSizes; // Cast to specific type
      roomAreas['Ruangan'] = getArea(s['Ruangan']) * 1;
      roomAreas['KM'] = getArea(s['KM']) * bathrooms;
      roomAreas['R Terbuka'] = totalArea - ((roomAreas['Ruangan'] || 0) + (roomAreas['KM'] || 0));
    }

    for (const room in roomAreas) {
      totalCalculatedArea += roomAreas[room];
    }
    const sisaRuangBebas = totalArea - totalCalculatedArea;
    if (sisaRuangBebas < -0.01) { // Allow for small floating point inaccuracies
      setError('Error: Ukuran bangunan kurang. Sisa ruang bebas negatif. Sesuaikan dimensi atau jumlah kamar/kamar mandi.');
      return;
    }

    const currentBaseCost = baseCosts[buildingType];
    const currentMaterialCoef = materialCoefs[material];
    const currentDesignCoef = designCoefs[design];

    const totalCost = currentBaseCost * currentMaterialCoef * currentDesignCoef * totalArea;
    const formattedCost = 'Rp. ' + totalCost.toLocaleString('id-ID');

    let workItems: WorkItemPercentagesMap;

    // Narrowing types for workItemPercentages based on buildingType
    if (buildingType === 'rumah') {
      workItems = workItemPercentages.rumah[category as keyof WorkItemPercentages['rumah']];
    } else if (buildingType === 'kos') {
      workItems = workItemPercentages.kos[category as keyof WorkItemPercentages['kos']];
    } else if (buildingType === 'ruko') {
      workItems = workItemPercentages.ruko[category as keyof WorkItemPercentages['ruko']];
    } else if (buildingType === 'gudang') {
      workItems = workItemPercentages.gudang[category as keyof WorkItemPercentages['gudang']];
    } else {
      setError('Jenis bangunan tidak valid untuk item pekerjaan.');
      return;
    }

    if (!workItems) {
      setError('Konfigurasi item pekerjaan tidak ditemukan untuk pilihan ini.');
      return;
    }

    let workItemCosts = Object.entries(workItems).map(([item, percentage]) => ({
      name: item,
      percentage: ((percentage as number) * 100).toFixed(1) + '%', // Cast to number
      cost: (percentage as number) * totalCost // Cast to number
    }));

    workItemCosts.sort((a, b) => b.cost - a.cost);

    setResult(
      <>
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">Estimasi Biaya Total: {formattedCost}</h2>
        <p className="text-lg text-textSecondary mb-6">Luas Bangunan: {totalArea.toFixed(2)} m²</p>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-text mb-4">Detail Luas Ruang</h3>
          <Table className="w-full text-left rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow className="bg-surface/80">
                <TableHead className="px-4 py-3 text-text">Ruangan</TableHead>
                <TableHead className="px-4 py-3 text-text">Luas (m²)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(roomAreas).map(([room, area]) => (
                <TableRow key={room} className="border-b border-border hover:bg-surface/50 transition-colors">
                  <TableCell className="px-4 py-2 text-textSecondary">{room}</TableCell>
                  <TableCell className="px-4 py-2 text-textSecondary">{area.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="border-b border-border hover:bg-surface/50 transition-colors">
                <TableCell className="px-4 py-2 font-semibold text-text">Sisa Ruang Bebas</TableCell>
                <TableCell className="px-4 py-2 font-semibold text-text">{sisaRuangBebas.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-text mb-4">Rincian Biaya per Item Pekerjaan</h3>
          <Table className="w-full text-left rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow className="bg-surface/80">
                <TableHead className="px-4 py-3 text-text">Item Pekerjaan</TableHead>
                <TableHead className="px-4 py-3 text-text">Persentase</TableHead>
                <TableHead className="px-4 py-3 text-text">Biaya</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workItemCosts.map((item, index) => (
                <TableRow key={index} className="border-b border-border hover:bg-surface/50 transition-colors">
                  <TableCell className="px-4 py-2 text-textSecondary">{item.name}</TableCell>
                  <TableCell className="px-4 py-2 text-textSecondary">{item.percentage}</TableCell>
                  <TableCell className="px-4 py-2 text-textSecondary">Rp. {Math.round(item.cost).toLocaleString('id-ID')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col items-center justify-center bg-background text-text">
      <Card className="w-full max-w-4xl bg-surface shadow-2xl border-border rounded-xl p-6 md:p-8 animate-fade-in">
        <CardHeader className="text-center mb-8">
          <CardTitle className="text-4xl font-extrabold text-primary mb-2 flex items-center justify-center gap-3">
            <Building className="h-10 w-10 text-accent" />
            Kalkulator Biaya Bangunan
          </CardTitle>
          <CardDescription className="text-textSecondary text-lg">
            Estimasi biaya pembangunan impian Anda dengan mudah dan akurat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <Label htmlFor="buildingType" className="text-text">Jenis Bangunan:</Label>
              <Select value={buildingType} onValueChange={(value) => setBuildingType(value as keyof RoomSizes)}>
                <SelectTrigger className="w-full bg-background border-border text-text rounded-lg focus:ring-primary">
                  <SelectValue placeholder="Pilih Jenis Bangunan" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border rounded-lg">
                  <SelectItem value="rumah" className="hover:bg-surface/50 focus:bg-surface/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4" /> Rumah
                    </div>
                  </SelectItem>
                  <SelectItem value="kos" className="hover:bg-surface/50 focus:bg-surface/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" /> Kos
                    </div>
                  </SelectItem>
                  <SelectItem value="ruko" className="hover:bg-surface/50 focus:bg-surface/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4" /> Ruko
                    </div>
                  </SelectItem>
                  <SelectItem value="gudang" className="hover:bg-surface/50 focus:bg-surface/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Warehouse className="h-4 w-4" /> Gudang
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material" className="text-text">Spesifikasi Material:</Label>
              <Select value={material} onValueChange={(value) => setMaterial(value as keyof typeof materialCoefs)}>
                <SelectTrigger className="w-full bg-background border-border text-text rounded-lg focus:ring-primary">
                  <SelectValue placeholder="Pilih Spesifikasi Material" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border rounded-lg">
                  <SelectItem value="standar" className="hover:bg-surface/50 focus:bg-surface/50 rounded-md">Standar</SelectItem>
                  <SelectItem value="menengah" className="hover:bg-surface/50 focus:bg-surface/50 rounded-md">Menengah</SelectItem>
                  <SelectItem value="mewah" className="hover:bg-surface/50 focus:bg-surface/50 rounded-md">Mewah</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="design" className="text-text">Desain Bangunan:</Label>
              <Select value={design} onValueChange={(value) => setDesign(value as keyof typeof designCoefs)}>
                <SelectTrigger className="w-full bg-background border-border text-text rounded-lg focus:ring-primary">
                  <SelectValue placeholder="Pilih Desain Bangunan" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border rounded-lg">
                  <SelectItem value="minimalis" className="hover:bg-surface/50 focus:bg-surface/50 rounded-md">Minimalis</SelectItem>
                  <SelectItem value="skandinavia" className="hover:bg-surface/50 focus:bg-surface/50 rounded-md">Skandinavia</SelectItem>
                  <SelectItem value="tropis" className="hover:bg-surface/50 focus:bg-surface/50 rounded-md">Tropis</SelectItem>
                  <SelectItem value="modern" className="hover:bg-surface/50 focus:bg-surface/50 rounded-md">Modern</SelectItem>
                  <SelectItem value="klasik" className="hover:bg-surface/50 focus:bg-surface/50 rounded-md">Klasik</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="length" className="text-text">Panjang (m):</Label>
              <Input
                id="length"
                type="number"
                min="0"
                step="0.01"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value))}
                required
                className="bg-background border-border text-text rounded-lg focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="width" className="text-text">Lebar (m):</Label>
              <Input
                id="width"
                type="number"
                min="0"
                step="0.01"
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value))}
                required
                className="bg-background border-border text-text rounded-lg focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floors" className="text-text">Jumlah Lantai:</Label>
              <Input
                id="floors"
                type="number"
                min="1"
                value={floors}
                onChange={(e) => setFloors(parseInt(e.target.value))}
                required
                className="bg-background border-border text-text rounded-lg focus:ring-primary"
              />
            </div>

            {showRukoCategory && (
              <div id="rukoCategory" className="space-y-2">
                <Label htmlFor="rukoType" className="text-text">Kategori Ruko:</Label>
                <Select value={rukoType} onValueChange={(value) => setRukoType(value as keyof RoomSizes['ruko'])}>
                  <SelectTrigger className="w-full bg-background border-border text-text rounded-lg focus:ring-primary">
                    <SelectValue placeholder="Pilih Kategori Ruko" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border rounded-lg">
                    <SelectItem value="siap huni" className="hover:bg-surface/50 focus:bg-surface/50 rounded-md">Siap Huni</SelectItem>
                    <SelectItem value="kosong" className="hover:bg-surface/50 focus:bg-surface/50 rounded-md">Kosong</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div id="roomInputs" className="space-y-2">
              <Label htmlFor="rooms" className="text-text">{roomsLabelText}</Label>
              <Input
                id="rooms"
                type="number"
                min="0"
                value={rooms}
                onChange={(e) => setRooms(parseInt(e.target.value))}
                disabled={isRoomsInputDisabled}
                className="bg-background border-border text-text rounded-lg focus:ring-primary disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms" className="text-text">Jumlah Kamar Mandi:</Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                value={bathrooms}
                onChange={(e) => setBathrooms(parseInt(e.target.value))}
                className="bg-background border-border text-text rounded-lg focus:ring-primary"
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

          {result && (
            <div id="result" className="mt-8 p-6 bg-background border border-border rounded-xl shadow-inner animate-fade-in">
              {result}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BuildingCostCalculator;
