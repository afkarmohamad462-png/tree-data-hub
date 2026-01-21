import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Save, Image as ImageIcon, Link, Upload } from "lucide-react";
import { toast } from "sonner";

interface HeroSettings {
  badge_text: string;
  title_line1: string;
  title_line2: string;
  description: string;
  button_text: string;
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
  stat3_value: string;
  stat3_label: string;
  image_url: string;
  image_type: "default" | "url" | "upload";
  // Gambar kedua (Image Card)
  secondary_image_url: string;
  secondary_image_type: "none" | "url" | "upload";
  secondary_image_title: string;
  secondary_image_description: string;
}

const defaultSettings: HeroSettings = {
  badge_text: "Sistem Pendataan Pohon",
  title_line1: "Bank Data",
  title_line2: "Pohon",
  description: "Sistem pendataan pohon untuk mendukung program Agro Mopomulo untuk pelestarian lingkungan. Mari bersama menjaga bumi untuk generasi mendatang.",
  button_text: "Form Pendataan Pohon",
  stat1_value: "10K+",
  stat1_label: "Pohon Tercatat",
  stat2_value: "50+",
  stat2_label: "Jenis Pohon",
  stat3_value: "25",
  stat3_label: "OPD Terlibat",
  image_url: "",
  image_type: "default",
  secondary_image_url: "",
  secondary_image_type: "none",
  secondary_image_title: "Dokumentasi Program Agro Mopomulo",
  secondary_image_description: "",
};

const HeroSettings = () => {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<HeroSettings>(defaultSettings);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadingSecondary, setUploadingSecondary] = useState(false);
  const [secondaryPreviewUrl, setSecondaryPreviewUrl] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["hero-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "hero")
        .single();

      if (error) throw error;
      return data?.value as unknown as HeroSettings;
    },
  });

  useEffect(() => {
    if (data) {
      setSettings({ ...defaultSettings, ...data });
      if (data.image_url) {
        setPreviewUrl(data.image_url);
      }
      if (data.secondary_image_url) {
        setSecondaryPreviewUrl(data.secondary_image_url);
      }
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (newSettings: HeroSettings) => {
      const { error } = await supabase
        .from("site_settings")
        .update({ value: JSON.parse(JSON.stringify(newSettings)) })
        .eq("key", "hero");

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-settings"] });
      toast.success("Pengaturan hero berhasil disimpan!");
    },
    onError: (error) => {
      toast.error("Gagal menyimpan pengaturan: " + error.message);
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("hero-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("hero-images")
        .getPublicUrl(fileName);

      const newUrl = urlData.publicUrl;
      setPreviewUrl(newUrl);
      setSettings((prev) => ({ ...prev, image_url: newUrl, image_type: "upload" }));
      toast.success("Gambar berhasil diupload!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error("Gagal mengupload gambar: " + errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setSettings((prev) => ({ ...prev, image_url: url, image_type: "url" }));
    setPreviewUrl(url);
  };

  const handleImageTypeChange = (type: "default" | "url" | "upload") => {
    setSettings((prev) => ({ ...prev, image_type: type }));
    if (type === "default") {
      setPreviewUrl("");
      setSettings((prev) => ({ ...prev, image_url: "" }));
    }
  };

  // Secondary image handlers
  const handleSecondaryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setUploadingSecondary(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `secondary-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("hero-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("hero-images")
        .getPublicUrl(fileName);

      const newUrl = urlData.publicUrl;
      setSecondaryPreviewUrl(newUrl);
      setSettings((prev) => ({ ...prev, secondary_image_url: newUrl, secondary_image_type: "upload" }));
      toast.success("Gambar berhasil diupload!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error("Gagal mengupload gambar: " + errorMessage);
    } finally {
      setUploadingSecondary(false);
    }
  };

  const handleSecondaryUrlChange = (url: string) => {
    setSettings((prev) => ({ ...prev, secondary_image_url: url, secondary_image_type: "url" }));
    setSecondaryPreviewUrl(url);
  };

  const handleSecondaryImageTypeChange = (type: "none" | "url" | "upload") => {
    setSettings((prev) => ({ ...prev, secondary_image_type: type }));
    if (type === "none") {
      setSecondaryPreviewUrl("");
      setSettings((prev) => ({ ...prev, secondary_image_url: "" }));
    }
  };

  const handleSave = () => {
    updateMutation.mutate(settings);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Pengaturan Hero Section</h2>
        <p className="text-muted-foreground">Sesuaikan tampilan hero section di halaman utama</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Text Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Teks & Konten</CardTitle>
            <CardDescription>Sesuaikan teks yang ditampilkan di hero section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="badge">Badge Text</Label>
              <Input
                id="badge"
                value={settings.badge_text}
                onChange={(e) => setSettings((prev) => ({ ...prev, badge_text: e.target.value }))}
                placeholder="Sistem Pendataan Pohon"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title1">Judul Baris 1</Label>
                <Input
                  id="title1"
                  value={settings.title_line1}
                  onChange={(e) => setSettings((prev) => ({ ...prev, title_line1: e.target.value }))}
                  placeholder="Bank Data"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title2">Judul Baris 2</Label>
                <Input
                  id="title2"
                  value={settings.title_line2}
                  onChange={(e) => setSettings((prev) => ({ ...prev, title_line2: e.target.value }))}
                  placeholder="Pohon"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) => setSettings((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Deskripsi hero section..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="button">Teks Tombol</Label>
              <Input
                id="button"
                value={settings.button_text}
                onChange={(e) => setSettings((prev) => ({ ...prev, button_text: e.target.value }))}
                placeholder="Form Pendataan Pohon"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Statistik</CardTitle>
            <CardDescription>Sesuaikan angka statistik yang ditampilkan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stat1_value">Statistik 1 (Nilai)</Label>
                <Input
                  id="stat1_value"
                  value={settings.stat1_value}
                  onChange={(e) => setSettings((prev) => ({ ...prev, stat1_value: e.target.value }))}
                  placeholder="10K+"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stat1_label">Statistik 1 (Label)</Label>
                <Input
                  id="stat1_label"
                  value={settings.stat1_label}
                  onChange={(e) => setSettings((prev) => ({ ...prev, stat1_label: e.target.value }))}
                  placeholder="Pohon Tercatat"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stat2_value">Statistik 2 (Nilai)</Label>
                <Input
                  id="stat2_value"
                  value={settings.stat2_value}
                  onChange={(e) => setSettings((prev) => ({ ...prev, stat2_value: e.target.value }))}
                  placeholder="50+"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stat2_label">Statistik 2 (Label)</Label>
                <Input
                  id="stat2_label"
                  value={settings.stat2_label}
                  onChange={(e) => setSettings((prev) => ({ ...prev, stat2_label: e.target.value }))}
                  placeholder="Jenis Pohon"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stat3_value">Statistik 3 (Nilai)</Label>
                <Input
                  id="stat3_value"
                  value={settings.stat3_value}
                  onChange={(e) => setSettings((prev) => ({ ...prev, stat3_value: e.target.value }))}
                  placeholder="25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stat3_label">Statistik 3 (Label)</Label>
                <Input
                  id="stat3_label"
                  value={settings.stat3_label}
                  onChange={(e) => setSettings((prev) => ({ ...prev, stat3_label: e.target.value }))}
                  placeholder="OPD Terlibat"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Gambar Background</CardTitle>
            <CardDescription>Pilih sumber gambar untuk background hero section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={settings.image_type}
              onValueChange={(value) => handleImageTypeChange(value as "default" | "url" | "upload")}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="default" id="default" />
                <Label htmlFor="default" className="flex items-center gap-2 cursor-pointer">
                  <ImageIcon className="w-4 h-4" />
                  Gambar Default
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="url" id="url" />
                <Label htmlFor="url" className="flex items-center gap-2 cursor-pointer">
                  <Link className="w-4 h-4" />
                  Link URL
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="upload" id="upload" />
                <Label htmlFor="upload" className="flex items-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload File
                </Label>
              </div>
            </RadioGroup>

            {settings.image_type === "url" && (
              <div className="space-y-2">
                <Label htmlFor="image_url">URL Gambar</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={settings.image_url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}

            {settings.image_type === "upload" && (
              <div className="space-y-2">
                <Label htmlFor="file_upload">Upload Gambar</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="file_upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="max-w-sm"
                  />
                  {uploading && <Loader2 className="w-5 h-5 animate-spin" />}
                </div>
                <p className="text-sm text-muted-foreground">Format: JPG, PNG, WebP. Maksimal 5MB.</p>
              </div>
            )}

            {/* Preview */}
            {(settings.image_type !== "default" && previewUrl) && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setPreviewUrl("")}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Secondary Image Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Gambar Kedua (Image Card)</CardTitle>
            <CardDescription>Gambar yang ditampilkan di bawah hero section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="secondary_title">Judul Gambar</Label>
                <Input
                  id="secondary_title"
                  value={settings.secondary_image_title}
                  onChange={(e) => setSettings((prev) => ({ ...prev, secondary_image_title: e.target.value }))}
                  placeholder="Dokumentasi Program"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_desc">Deskripsi Gambar</Label>
                <Input
                  id="secondary_desc"
                  value={settings.secondary_image_description}
                  onChange={(e) => setSettings((prev) => ({ ...prev, secondary_image_description: e.target.value }))}
                  placeholder="Deskripsi gambar..."
                />
              </div>
            </div>

            <RadioGroup
              value={settings.secondary_image_type}
              onValueChange={(value) => handleSecondaryImageTypeChange(value as "none" | "url" | "upload")}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="none" id="secondary_none" />
                <Label htmlFor="secondary_none" className="flex items-center gap-2 cursor-pointer">
                  <ImageIcon className="w-4 h-4" />
                  Tidak Ditampilkan
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="url" id="secondary_url" />
                <Label htmlFor="secondary_url" className="flex items-center gap-2 cursor-pointer">
                  <Link className="w-4 h-4" />
                  Link URL
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="upload" id="secondary_upload" />
                <Label htmlFor="secondary_upload" className="flex items-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload File
                </Label>
              </div>
            </RadioGroup>

            {settings.secondary_image_type === "url" && (
              <div className="space-y-2">
                <Label htmlFor="secondary_image_url">URL Gambar</Label>
                <Input
                  id="secondary_image_url"
                  type="url"
                  value={settings.secondary_image_url}
                  onChange={(e) => handleSecondaryUrlChange(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}

            {settings.secondary_image_type === "upload" && (
              <div className="space-y-2">
                <Label htmlFor="secondary_file_upload">Upload Gambar</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="secondary_file_upload"
                    type="file"
                    accept="image/*"
                    onChange={handleSecondaryFileUpload}
                    disabled={uploadingSecondary}
                    className="max-w-sm"
                  />
                  {uploadingSecondary && <Loader2 className="w-5 h-5 animate-spin" />}
                </div>
                <p className="text-sm text-muted-foreground">Format: JPG, PNG, WebP. Maksimal 5MB.</p>
              </div>
            )}

            {/* Preview */}
            {(settings.secondary_image_type !== "none" && secondaryPreviewUrl) && (
              <div className="space-y-2">
                <Label>Preview Gambar Kedua</Label>
                <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border">
                  <img
                    src={secondaryPreviewUrl}
                    alt="Secondary Preview"
                    className="w-full h-full object-cover"
                    onError={() => setSecondaryPreviewUrl("")}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          size="lg"
        >
          {updateMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Simpan Pengaturan
        </Button>
      </div>
    </div>
  );
};

export default HeroSettings;
