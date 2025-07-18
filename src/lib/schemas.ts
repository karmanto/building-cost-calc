import { z } from 'zod';

export const calculatorSchema = z.object({
  buildingType: z.enum(['rumah', 'kos', 'ruko', 'gudang'], {
    required_error: 'Jenis bangunan wajib dipilih.',
  }),
  material: z.enum(['standar', 'menengah', 'mewah'], {
    required_error: 'Spesifikasi material wajib dipilih.',
  }),
  design: z.enum(['minimalis', 'skandinavia', 'tropis', 'modern', 'klasik'], {
    required_error: 'Desain bangunan wajib dipilih.',
  }),
  length: z.coerce.number().min(1, 'Panjang harus lebih dari 0.'),
  width: z.coerce.number().min(1, 'Lebar harus lebih dari 0.'),
  floors: z.coerce.number().min(1, 'Jumlah lantai minimal 1.'),
  rooms: z.coerce.number().min(0, 'Jumlah kamar/ruangan tidak boleh negatif.'),
  bathrooms: z.coerce.number().min(0, 'Jumlah kamar mandi tidak boleh negatif.'),
  rukoType: z.enum(['siap huni', 'kosong']).optional(),
});

export type CalculatorFormValues = z.infer<typeof calculatorSchema>;
