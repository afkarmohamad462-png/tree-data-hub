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
  Camera,
  Send,
  Upload,
  X,
  ExternalLink,
  Locate,
  Loader2
} from "lucide-react";

interface FormData {
  email: string;
  namaLengkap: string;
  jenisKelamin: string;
  alamat: string;
  noWhatsapp: string;
  opdId: string;
  jumlahPohon: string;
  jenisPohon: string;
  kategoriPohon: string;
  latitude: string;
  longitude: string;
  photo: File | null;
}

interface OPD {
  id: string;
  name: string;
}

const TreeForm = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [opdList, setOpdList] = useState<OPD[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    email: "",
    namaLengkap: "",
    jenisKelamin: "",
    alamat: "",
    noWhatsapp: "",
    opdId: "",
    jumlahPohon: "",
    jenisPohon: "",
    kategoriPohon: "",
    latitude: "",
    longitude: "",
    photo: null,
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

  const parseCoordinates = (input: string) => {
    // Try to parse Google Maps URL or direct coordinates
    const coordMatch = input.match(/-?\d+\.?\d*,\s*-?\d+\.?\d*/);
    if (coordMatch) {
      const [lat, lng] = coordMatch[0].split(',').map(s => parseFloat(s.trim()));
      return { lat, lng };
    }
    
    // Try to extract from Google Maps URL
    const urlMatch = input.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (urlMatch) {
      return { lat: parseFloat(urlMatch[1]), lng: parseFloat(urlMatch[2]) };
    }
    
    return null;
  };

  const openInGoogleMaps = () => {
    const lat = formData.latitude.trim();
    const lng = formData.longitude.trim();
    
    // Validate empty data
    if (!lat || !lng) {
      toast.error("Koordinat belum diisi", {
        description: "Masukkan latitude dan longitude terlebih dahulu."
      });
      return;
    }
    
    // Validate numeric format
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    
    if (isNaN(latNum) || isNaN(lngNum)) {
      toast.error("Format koordinat tidak valid", {
        description: "Pastikan latitude dan longitude berupa angka yang valid."
      });
      return;
    }
    
    // Validate coordinate ranges
    if (latNum < -90 || latNum > 90) {
      toast.error("Latitude tidak valid", {
        description: "Latitude harus berada di antara -90 dan 90."
      });
      return;
    }
    
    if (lngNum < -180 || lngNum > 180) {
      toast.error("Longitude tidak valid", {
        description: "Longitude harus berada di antara -180 dan 180."
      });
      return;
    }
    
    // Open Google Maps in new tab
    const url = `https://www.google.com/maps?q=${encodeURIComponent(latNum)},${encodeURIComponent(lngNum)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getCurrentLocation = () => {
    // Check if Geolocation API is supported
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.email || !formData.namaLengkap || !formData.jenisKelamin || 
        !formData.alamat || !formData.noWhatsapp || !formData.opdId || 
        !formData.jumlahPohon || !formData.jenisPohon || !formData.kategoriPohon) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      setIsSubmitting(false);
      return;
    }

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
        email: formData.email,
        full_name: formData.namaLengkap,
        gender: formData.jenisKelamin,
        address: formData.alamat,
        whatsapp: formData.noWhatsapp,
        opd_id: formData.opdId,
        tree_count: parseInt(formData.jumlahPohon),
        tree_type: formData.jenisPohon,
        tree_category: formData.kategoriPohon,
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
      jenisKelamin: "",
      alamat: "",
      noWhatsapp: "",
      opdId: "",
      jumlahPohon: "",
      jenisPohon: "",
      kategoriPohon: "",
      latitude: "",
      longitude: "",
      photo: null,
    });
    setPhotoPreview(null);
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

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Latitude
                </Label>
                <Input
                  id="latitude"
                  type="text"
                  placeholder="-6.xxxxx"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange("latitude", e.target.value)}
                  onClick={formData.latitude && formData.longitude ? openInGoogleMaps : undefined}
                  className={`h-12 transition-all focus:shadow-soft ${formData.latitude && formData.longitude ? 'cursor-pointer hover:bg-primary/5' : ''}`}
                  title={formData.latitude && formData.longitude ? "Klik untuk lihat di Google Maps" : undefined}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Longitude
                </Label>
                <Input
                  id="longitude"
                  type="text"
                  placeholder="106.xxxxx"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange("longitude", e.target.value)}
                  onClick={formData.latitude && formData.longitude ? openInGoogleMaps : undefined}
                  className={`h-12 transition-all focus:shadow-soft ${formData.latitude && formData.longitude ? 'cursor-pointer hover:bg-primary/5' : ''}`}
                  title={formData.latitude && formData.longitude ? "Klik untuk lihat di Google Maps" : undefined}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="default"
                size="sm"
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openInGoogleMaps}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Lihat di Google Maps
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Klik "Gunakan Lokasi Saya" untuk mengambil koordinat GPS otomatis, atau masukkan koordinat secara manual (opsional)
            </p>
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
