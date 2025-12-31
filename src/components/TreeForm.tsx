import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  TreePine, 
  Building2, 
  Camera,
  Send,
  Upload,
  X
} from "lucide-react";

interface FormData {
  email: string;
  namaLengkap: string;
  jenisKelamin: string;
  alamat: string;
  noWhatsapp: string;
  opd: string;
  jumlahPohon: string;
  jenisPohon: string;
  kategoriPohon: string;
  lokasiMaps: string;
  photo: File | null;
}

const TreeForm = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    email: "",
    namaLengkap: "",
    jenisKelamin: "",
    alamat: "",
    noWhatsapp: "",
    opd: "",
    jumlahPohon: "",
    jenisPohon: "",
    kategoriPohon: "",
    lokasiMaps: "",
    photo: null,
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.email || !formData.namaLengkap || !formData.jenisKelamin || 
        !formData.alamat || !formData.noWhatsapp || !formData.opd || 
        !formData.jumlahPohon || !formData.jenisPohon || !formData.kategoriPohon) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      setIsSubmitting(false);
      return;
    }

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Data pohon berhasil disimpan!", {
      description: "Terima kasih atas kontribusi Anda untuk penghijauan.",
    });

    // Reset form
    setFormData({
      email: "",
      namaLengkap: "",
      jenisKelamin: "",
      alamat: "",
      noWhatsapp: "",
      opd: "",
      jumlahPohon: "",
      jenisPohon: "",
      kategoriPohon: "",
      lokasiMaps: "",
      photo: null,
    });
    setPhotoPreview(null);
    setIsSubmitting(false);
  };

  const opdOptions = [
    "Dinas Lingkungan Hidup",
    "Dinas Pertanian",
    "Dinas Kehutanan",
    "Dinas Pekerjaan Umum",
    "Badan Perencanaan Pembangunan Daerah",
    "Kecamatan",
    "Kelurahan/Desa",
    "Lainnya",
  ];

  const jenisPohonBuah = [
    "Mangga", "Rambutan", "Durian", "Jeruk", "Jambu", 
    "Alpukat", "Pepaya", "Pisang", "Kelapa", "Lainnya"
  ];

  const jenisPohonKayu = [
    "Jati", "Mahoni", "Sengon", "Meranti", "Akasia",
    "Sonokeling", "Trembesi", "Pinus", "Eucalyptus", "Lainnya"
  ];

  return (
    <Card className="shadow-elevated border-0 overflow-hidden">
      <CardHeader className="bg-gradient-hero text-primary-foreground p-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-foreground/20 rounded-xl backdrop-blur-sm">
            <TreePine className="w-8 h-8" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Form Pendataan Pohon</CardTitle>
            <CardDescription className="text-primary-foreground/80 mt-1">
              Isi data dengan lengkap dan benar
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border">
              <User className="w-5 h-5 text-primary" />
              Informasi Pribadi
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contoh@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-12 transition-all focus:shadow-soft"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="namaLengkap" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Nama Lengkap <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="namaLengkap"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.namaLengkap}
                  onChange={(e) => handleInputChange("namaLengkap", e.target.value)}
                  className="h-12 transition-all focus:shadow-soft"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jenisKelamin">
                  Jenis Kelamin <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.jenisKelamin} onValueChange={(value) => handleInputChange("jenisKelamin", value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="noWhatsapp" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  No. WhatsApp <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="noWhatsapp"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={formData.noWhatsapp}
                  onChange={(e) => handleInputChange("noWhatsapp", e.target.value)}
                  className="h-12 transition-all focus:shadow-soft"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Alamat <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="alamat"
                placeholder="Masukkan alamat lengkap"
                value={formData.alamat}
                onChange={(e) => handleInputChange("alamat", e.target.value)}
                className="min-h-[100px] transition-all focus:shadow-soft resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="opd" className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                OPD (Organisasi Perangkat Daerah) <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.opd} onValueChange={(value) => handleInputChange("opd", value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Pilih OPD" />
                </SelectTrigger>
                <SelectContent>
                  {opdOptions.map((opd) => (
                    <SelectItem key={opd} value={opd.toLowerCase().replace(/\s+/g, '-')}>
                      {opd}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tree Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border">
              <TreePine className="w-5 h-5 text-primary" />
              Informasi Pohon
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="jumlahPohon">
                  Jumlah Pohon <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="jumlahPohon"
                  type="number"
                  min="1"
                  placeholder="Masukkan jumlah pohon"
                  value={formData.jumlahPohon}
                  onChange={(e) => handleInputChange("jumlahPohon", e.target.value)}
                  className="h-12 transition-all focus:shadow-soft"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kategoriPohon">
                  Kategori Pohon <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.kategoriPohon} 
                  onValueChange={(value) => {
                    handleInputChange("kategoriPohon", value);
                    handleInputChange("jenisPohon", "");
                  }}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buah">Pohon Buah</SelectItem>
                    <SelectItem value="kayu">Pohon Kayu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="jenisPohon">
                  Jenis Pohon <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.jenisPohon} 
                  onValueChange={(value) => handleInputChange("jenisPohon", value)}
                  disabled={!formData.kategoriPohon}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={formData.kategoriPohon ? "Pilih jenis pohon" : "Pilih kategori terlebih dahulu"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(formData.kategoriPohon === "buah" ? jenisPohonBuah : jenisPohonKayu).map((jenis) => (
                      <SelectItem key={jenis} value={jenis.toLowerCase()}>
                        {jenis}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border">
              <MapPin className="w-5 h-5 text-primary" />
              Lokasi Penanaman
            </h3>

            <div className="space-y-2">
              <Label htmlFor="lokasiMaps" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Link Google Maps / Koordinat
              </Label>
              <Input
                id="lokasiMaps"
                type="text"
                placeholder="https://maps.google.com/... atau -6.xxxxx, 106.xxxxx"
                value={formData.lokasiMaps}
                onChange={(e) => handleInputChange("lokasiMaps", e.target.value)}
                className="h-12 transition-all focus:shadow-soft"
              />
              <p className="text-sm text-muted-foreground">
                Salin link dari Google Maps atau masukkan koordinat lokasi penanaman
              </p>
            </div>

            {/* Map Preview Placeholder */}
            <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center">
              <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                Pratinjau peta akan muncul di sini setelah lokasi dimasukkan
              </p>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border">
              <Camera className="w-5 h-5 text-primary" />
              Dokumentasi Foto
            </h3>

            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />

              {photoPreview ? (
                <div className="relative rounded-xl overflow-hidden shadow-card">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-3 right-3 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="photo-upload"
                  className="flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                >
                  <Upload className="w-12 h-12 text-primary mb-3" />
                  <span className="text-foreground font-medium">Klik untuk upload foto</span>
                  <span className="text-sm text-muted-foreground mt-1">JPG, PNG maksimal 5MB</span>
                </label>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Data Pohon
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TreeForm;
