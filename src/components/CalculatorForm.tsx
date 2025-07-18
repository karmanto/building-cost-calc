import { useEffect } from 'react'; // Removed 'React' as it's not explicitly used
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building, Ruler, LayoutGrid, Bath, Bed } from 'lucide-react'; // Removed DollarSign, Home

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator'; // Removed Separator as it's not used

import calculatorData from '@/data/calculatorData.json';
import { CalculatorFormValues, calculatorSchema } from '@/lib/schemas';

interface CalculatorFormProps {
  onSubmit: (values: CalculatorFormValues) => void;
  isLoading: boolean;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ onSubmit, isLoading }) => {
  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      buildingType: 'rumah',
      material: 'standar',
      design: 'minimalis',
      length: 10,
      width: 10,
      floors: 1,
      rooms: 0,
      bathrooms: 0,
      rukoType: 'siap huni', // Default for ruko, will be hidden if not ruko
    },
  });

  const buildingType = form.watch('buildingType');
  const material = form.watch('material');
  const rukoType = form.watch('rukoType');

  // Adjust inputs visibility based on building type
  useEffect(() => {
    if (buildingType === 'ruko') {
      form.setValue('rooms', 0); // Reset rooms for ruko
      if (rukoType === 'kosong') {
        form.setValue('rooms', 0);
        form.setValue('bathrooms', 0);
      }
    } else if (buildingType === 'gudang') {
      form.setValue('rooms', 0); // Reset rooms for gudang
      form.setValue('bathrooms', 0); // Reset bathrooms for gudang
    }
  }, [buildingType, rukoType, form]);

  // Adjust kos category based on material
  useEffect(() => {
    if (buildingType === 'kos') {
      // const kosCategory = material === 'standar' ? 'ekonomi' : 'eksekutif'; // Removed unused variable
      // This logic is more for internal calculation, not a form field
      // but if there was a 'kosCategory' field, it would be set here.
      // For now, it just ensures the internal logic aligns.
    }
  }, [buildingType, material]);

  const isRuko = buildingType === 'ruko';
  const isGudang = buildingType === 'gudang';
  const showRoomsAndBathrooms = !isRuko && !isGudang;
  const showRukoCategory = isRuko;
  const disableRoomsForEmptyRuko = isRuko && rukoType === 'kosong';

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-xl overflow-hidden animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-6 rounded-t-xl">
        <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
          <Building className="w-8 h-8" /> Kalkulator Biaya Bangunan
        </CardTitle>
        <CardDescription className="text-primary-foreground/80 mt-2 text-center">
          Estimasi biaya pembangunan impian Anda dengan mudah.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="buildingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building className="w-4 h-4" /> Jenis Bangunan
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih jenis bangunan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {calculatorData.buildingTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4" /> Spesifikasi Material
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih spesifikasi material" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {calculatorData.materialSpecs.map((spec) => (
                          <SelectItem key={spec.value} value={spec.value}>
                            {spec.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="design"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4" /> Desain Bangunan
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih desain bangunan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {calculatorData.designTypes.map((design) => (
                          <SelectItem key={design.value} value={design.value}>
                            {design.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="floors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building className="w-4 h-4" /> Jumlah Lantai
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Ruler className="w-4 h-4" /> Panjang (m)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Ruler className="w-4 h-4" /> Lebar (m)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {showRukoCategory && (
              <FormField
                control={form.control}
                name="rukoType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building className="w-4 h-4" /> Kategori Ruko
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih kategori ruko" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {calculatorData.rukoCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {showRoomsAndBathrooms && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="rooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Bed className="w-4 h-4" /> Jumlah Kamar/Ruangan
                      </FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min="0" disabled={disableRoomsForEmptyRuko} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Bath className="w-4 h-4" /> Jumlah Kamar Mandi
                      </FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min="0" disabled={disableRoomsForEmptyRuko} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Button type="submit" className="w-full py-3 text-lg font-semibold transition-all duration-300 hover:scale-105" disabled={isLoading}>
              {isLoading ? 'Menghitung...' : 'Hitung Biaya'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CalculatorForm;
