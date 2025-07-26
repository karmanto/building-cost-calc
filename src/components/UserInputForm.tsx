import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { saveCalculatorUser } from '@/lib/api';
import { toast } from 'sonner'; // Assuming sonner is installed and configured

interface UserInputFormProps {
  onUserDataSet: (email: string) => void;
}

const UserInputForm: React.FC<UserInputFormProps> = ({ onUserDataSet }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !email) {
      setError('Nama dan Email harus diisi.');
      setLoading(false);
      return;
    }

    try {
      const response = await saveCalculatorUser({ name, email });
      if (response.user && response.user.email) {
        // Simpan email pengguna di localStorage agar tidak perlu input lagi
        localStorage.setItem('calculatorUserEmail', response.user.email);
        toast.success('Data pengguna berhasil disimpan!');
        onUserDataSet(response.user.email); // Panggil callback untuk memberi tahu App.tsx
      } else {
        setError('Gagal menyimpan data pengguna. Silakan coba lagi.');
        toast.error('Gagal menyimpan data pengguna.');
      }
    } catch (err: any) {
      console.error('Error saving user data:', err);
      // Parse error message from backend if available
      let errorMessage = 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.';
      try {
        const parsedError = JSON.parse(err.message);
        if (parsedError && parsedError.email) {
          errorMessage = `Email: ${parsedError.email.join(', ')}`;
        } else if (parsedError && parsedError.name) {
          errorMessage = `Nama: ${parsedError.name.join(', ')}`;
        } else if (parsedError && typeof parsedError === 'string') {
          errorMessage = parsedError;
        }
      } catch (parseErr) {
        // If not JSON, use the raw message
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-md bg-card shadow-md border-border rounded-xl p-2 md:p-8 animate-fade-in">
        <CardHeader className="text-center mb-8">
          <CardTitle className="text-3xl font-extrabold text-foreground mb-2">
            Selamat Datang!
          </CardTitle>
          <CardDescription className="text-muted-foreground text-lg">
            Sebelum memulai, mohon masukkan nama dan email Anda.
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
              <Label htmlFor="email" className="text-foreground">Email:</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
    </div>
  );
};

export default UserInputForm;
