import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DollarSign, LayoutGrid } from 'lucide-react';

interface ResultDisplayProps {
  totalCost: number | null;
  totalArea: number | null;
  roomAreaDetails: Record<string, number> | null;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  totalCost,
  totalArea,
  roomAreaDetails,
  error,
}) => {
  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8 bg-red-900/20 border-red-700 text-red-300 shadow-lg rounded-xl animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Terjadi Kesalahan</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (totalCost === null) {
    return null; // Don't render anything until a calculation is made
  }

  const formattedCost = `Rp. ${totalCost.toLocaleString('id-ID')}`;

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 shadow-lg rounded-xl overflow-hidden animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-secondary to-accent text-secondary-foreground p-6 rounded-t-xl">
        <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
          <DollarSign className="w-6 h-6" /> Hasil Estimasi Biaya
        </CardTitle>
        <CardDescription className="text-secondary-foreground/80 mt-2 text-center">
          Detail perhitungan biaya bangunan Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Estimasi Biaya Total:</p>
          <p className="text-4xl font-extrabold text-primary animate-pulse-once">
            {formattedCost}
          </p>
        </div>
        <Separator className="my-4" />
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Luas Bangunan:</p>
          <p className="text-2xl font-bold text-foreground">
            {totalArea?.toFixed(2)} m²
          </p>
        </div>
        {roomAreaDetails && Object.keys(roomAreaDetails).length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5" /> Detail Luas Ruang:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {Object.entries(roomAreaDetails).map(([room, area]) => (
                  <div key={room} className="flex justify-between items-center p-2 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors">
                    <span className="font-medium text-muted-foreground">{room}:</span>
                    <span className="font-semibold text-foreground">{area.toFixed(2)} m²</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
