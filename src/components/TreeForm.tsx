import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  TreePine, 
  Building2, 
  Send,
  Locate,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  Sprout
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FormData {
  email: string;
  namaLengkap: string;
  nip: string;
  jenisKelamin: string;
  alamat: string;
  noWhatsapp: string;
  opdId: string;
  jumlahPohon: string;
  jenisPohon: string;
  kategoriPohon: string;
  sumberBibit: string;
  latitude: string;
  longitude: string;
}

interface OPD {
  id: string;
  name: string;
}

const TOTAL_STEPS = 4;

const TreeForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [opdList, setOpdList] = useState<OPD[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    email: "",
    namaLengkap: "",
    nip: "",
    jenisKelamin: "",
    alamat: "",
    noWhatsapp: "",
    opdId: "",
    jumlahPohon: "",
    jenisPohon: "",
    kategoriPohon: "",
    sumberBibit: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    fetchOPDList();
  }, []);

  const fetchOPDList = async () => {
    const { data, error } = await supabase
      .from('opd')
      .select('id, name')
      .order('name');
    
    if (!error && data) {
      setOpdList(data);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("GPS tidak didukung", {
        description: "Browser Anda tidak mendukung fitur geolokasi."
      });
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleInputChange("latitude", latitude.toFixed(6));
        handleInputChange("longitude", longitude.toFixed(6));
        setIsGettingLocation(false);
        toast.success("Lokasi berhasil didapatkan!", {
          description: `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`
        });
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = "Gagal mendapatkan lokasi.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Akses lokasi ditolak. Mohon izinkan akses lokasi di browser Anda.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Informasi lokasi tidak tersedia.";
            break;
          case error.TIMEOUT:
            errorMessage = "Waktu permintaan lokasi habis. Silakan coba lagi.";
            break;
        }
        
        toast.error("Gagal mendapatkan lokasi", {
          description: errorMessage
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.email || !formData.namaLengkap || !formData.nip) {
          toast.error("Mohon lengkapi semua field yang wajib diisi");
          return false;
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          toast.error("Format email tidak valid");
          return false;
        }
        return true;
      case 2:
        if (!formData.jenisKelamin || !formData.noWhatsapp || !formData.alamat) {
          toast.error("Mohon lengkapi semua field yang wajib diisi");
          return false;
        }
        return true;
      case 3:
        if (!formData.opdId || !formData.jumlahPohon || !formData.kategoriPohon || !formData.jenisPohon) {
          toast.error("Mohon lengkapi semua field yang wajib diisi");
          return false;
        }
        return true;
      case 4:
        if (!formData.sumberBibit) {
          toast.error("Mohon pilih sumber bibit");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);

    // Parse coordinates if provided
    let latitude: number | null = null;
    let longitude: number | null = null;
    
    if (formData.latitude && formData.longitude) {
      latitude = parseFloat(formData.latitude);
      longitude = parseFloat(formData.longitude);
    }

    // Insert to database
    const { error } = await supabase
      .from('tree_registrations')
      .insert({
        email: formData.email.trim(),
        full_name: formData.namaLengkap.trim(),
        nip: formData.nip.trim(),
        gender: formData.jenisKelamin,
        address: formData.alamat.trim(),
        whatsapp: formData.noWhatsapp.trim(),
        opd_id: formData.opdId,
        tree_count: parseInt(formData.jumlahPohon),
        tree_type: formData.jenisPohon,
        tree_category: formData.kategoriPohon,
        seed_source: formData.sumberBibit,
        latitude,
        longitude,
      });

    if (error) {
      console.error('Error submitting:', error);
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
      setIsSubmitting(false);
      return;
    }
    
    toast.success("Data pohon berhasil disimpan!", {
      description: "Terima kasih atas kontribusi Anda untuk penghijauan.",
    });

    // Reset form
    setFormData({
      email: "",
      namaLengkap: "",
      nip: "",
      jenisKelamin: "",
      alamat: "",
      noWhatsapp: "",
      opdId: "",
      jumlahPohon: "",
      jenisPohon: "",
      kategoriPohon: "",
      sumberBibit: "",
      latitude: "",
      longitude: "",
    });
    setCurrentStep(1);
    setIsSubmitting(false);
  };

  const jenisPohonBuah = [
    "Mangga", "Rambutan", "Durian", "Jeruk", "Jambu", 
    "Alpukat", "Pepaya", "Pisang", "Kelapa", "Lainnya"
  ];

  const jenisPohonKayu = [
    "Jati", "Mahoni", "Sengon", "Meranti", "Akasia",
    "Sonokeling", "Trembesi", "Pinus", "Eucalyptus", "Lainnya"
  ];

  const sumberBibitOptions = [
    "Pembibitan Sendiri",
    "Bantuan Pemerintah",
    "Pembelian dari Penangkar",
    "Sumbangan/Donasi",
    "Lainnya"
  ];

  const stepTitles = [
    "Data Diri",
    "Kontak & Alamat",
    "Data OPD & Pohon",
    "Sumber & Lokasi"
  ];

  const progressValue = (currentStep / TOTAL_STEPS) * 100;

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
              Langkah {currentStep} dari {TOTAL_STEPS}: {stepTitles[currentStep - 1]}
            </CardDescription>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <Progress value={progressValue} className="h-2 bg-primary-foreground/20" />
          <div className="flex justify-between mt-3">
            {stepTitles.map((title, index) => (
              <div 
                key={index}
                className={`flex flex-col items-center ${index + 1 <= currentStep ? 'text-primary-foreground' : 'text-primary-foreground/50'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                  ${index + 1 < currentStep ? 'bg-primary-foreground text-primary' : 
                    index + 1 === currentStep ? 'bg-primary-foreground/30 border-2 border-primary-foreground' : 
                    'bg-primary-foreground/10 border border-primary-foreground/30'}`}
                >
                  {index + 1 < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{title}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Step 1: Email, Nama Lengkap, NIP */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border">
                <User className="w-5 h-5 text-primary" />
                Data Diri
              </h3>
              
              <div className="space-y-6">
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
                  <Label htmlFor="nip" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    NIP <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nip"
                    type="text"
                    placeholder="Masukkan NIP"
                    value={formData.nip}
                    onChange={(e) => handleInputChange("nip", e.target.value)}
                    className="h-12 transition-all focus:shadow-soft"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Jenis Kelamin, No WhatsApp, Alamat */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border">
                <Phone className="w-5 h-5 text-primary" />
                Kontak & Alamat
              </h3>
              
              <div className="space-y-6">
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
              </div>
            </div>
          )}

          {/* Step 3: OPD, Jumlah Pohon, Jenis Pohon */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border">
                <Building2 className="w-5 h-5 text-primary" />
                Data OPD & Pohon
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="opd" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    OPD (Organisasi Perangkat Daerah) <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.opdId} onValueChange={(value) => handleInputChange("opdId", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Pilih OPD" />
                    </SelectTrigger>
                    <SelectContent>
                      {opdList.map((opd) => (
                        <SelectItem key={opd.id} value={opd.id}>
                          {opd.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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

                <div className="space-y-2">
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
          )}

          {/* Step 4: Sumber Bibit, Lokasi Tanam, Submit */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border">
                <Sprout className="w-5 h-5 text-primary" />
                Sumber Bibit & Lokasi
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sumberBibit" className="flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-muted-foreground" />
                    Sumber Bibit <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.sumberBibit} onValueChange={(value) => handleInputChange("sumberBibit", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Pilih sumber bibit" />
                    </SelectTrigger>
                    <SelectContent>
                      {sumberBibitOptions.map((source) => (
                        <SelectItem key={source} value={source.toLowerCase()}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Lokasi Penanaman (Opsional)
                  </Label>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude" className="text-sm text-muted-foreground">
                        Latitude
                      </Label>
                      <Input
                        id="latitude"
                        type="text"
                        placeholder="-6.xxxxx"
                        value={formData.latitude}
                        onChange={(e) => handleInputChange("latitude", e.target.value)}
                        className="h-12 transition-all focus:shadow-soft"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude" className="text-sm text-muted-foreground">
                        Longitude
                      </Label>
                      <Input
                        id="longitude"
                        type="text"
                        placeholder="106.xxxxx"
                        value={formData.longitude}
                        onChange={(e) => handleInputChange("longitude", e.target.value)}
                        className="h-12 transition-all focus:shadow-soft"
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="flex items-center gap-2"
                  >
                    {isGettingLocation ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Locate className="w-4 h-4" />
                    )}
                    {isGettingLocation ? "Mengambil Lokasi..." : "Gunakan Lokasi Saya"}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Klik tombol di atas untuk mengambil koordinat GPS otomatis
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </Button>
            
            {currentStep < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="hero"
                size="lg"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Data Pohon
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TreeForm;
