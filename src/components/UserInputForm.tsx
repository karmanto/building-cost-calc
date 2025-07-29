import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { saveCalculatorUser } from '@/lib/api';
import { toast } from 'sonner';

interface UserInputFormProps {
  onSuccess: (name: string) => void; // Changed to pass name
  onClose: () => void; // Added for dialog close button
}

const UserInputForm: React.FC<UserInputFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState<string>('');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [domisili, setDomisili] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !whatsappNumber || !domisili) {
      setError('Nama Lengkap, Nomor WhatsApp, dan Domisili harus diisi.');
      setLoading(false);
      return;
    }

    try {
      const response = await saveCalculatorUser({ name, whatsapp_number: whatsappNumber, domisili });
      if (response.user && response.user.name) {
        toast.success('Data pengguna berhasil disimpan!');
        onSuccess(response.user.name); // Call the new onSuccess callback with name
      } else {
        setError('Gagal menyimpan data pengguna. Silakan coba lagi.');
        toast.error('Gagal menyimpan data pengguna.');
      }
    } catch (err: any) {
      console.error('Error saving user data:', err);
      let errorMessage = 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.';
      try {
        const parsedError = JSON.parse(err.message);
        if (parsedError && parsedError.whatsapp_number) {
          errorMessage = `Nomor WhatsApp: ${parsedError.whatsapp_number.join(', ')}`;
        } else if (parsedError && parsedError.name) {
          errorMessage = `Nama: ${parsedError.name.join(', ')}`;
        } else if (parsedError && parsedError.domisili) {
          errorMessage = `Domisili: ${parsedError.domisili.join(', ')}`;
        } else if (parsedError && typeof parsedError === 'string') {
          errorMessage = parsedError;
        }
      } catch (parseErr) {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-card shadow-md border-border rounded-xl p-2 md:p-8 animate-fade-in">
      <CardHeader className="text-center mb-8">
        <CardDescription className="text-muted-foreground text-lg">
          Isikan nama dan domisili anda untuk hasil yang akurat.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Nama Lengkap:</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-background border-border text-foreground rounded-lg focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber" className="text-foreground">Nomor WhatsApp:</Label>
            <Input
              id="whatsappNumber"
              type="tel" // Use type="tel" for phone numbers
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              required
              className="bg-background border-border text-foreground rounded-lg focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domisili" className="text-foreground">Domisili:</Label>
            <Input
              id="domisili"
              type="text"
              value={domisili}
              onChange={(e) => setDomisili(e.target.value)}
              required
              className="bg-background border-border text-foreground rounded-lg focus:ring-primary"
            />
          </div>
          {error && (
            <div className="p-3 bg-error/20 text-error border border-error rounded-lg">
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}
          <Button
            type="submit"
            className="w-full py-3 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Lanjutkan'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserInputForm;
