import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Save, Image as ImageIcon, Link, Upload } from "lucide-react";
import { toast } from "sonner";

interface LogoSettings {
  logo_url: string;
  logo_type: "default" | "url" | "upload";
  site_name: string;
  site_subtitle: string;
}

const defaultSettings: LogoSettings = {
  logo_url: "",
  logo_type: "default",
  site_name: "Program Agro Mopomulo",
  site_subtitle: "Kabupaten Gorontalo Utara",
};

const LogoSettings = () => {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<LogoSettings>(defaultSettings);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["logo-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "logo")
        .maybeSingle();

      if (error) throw error;
      return data?.value as unknown as LogoSettings | null;
    },
  });

  useEffect(() => {
    if (data) {
      setSettings(data);
      if (data.logo_url) {
        setPreviewUrl(data.logo_url);
      }
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (newSettings: LogoSettings) => {
      // Check if record exists
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("key", "logo")
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("site_settings")
          .update({ value: JSON.parse(JSON.stringify(newSettings)) })
          .eq("key", "logo");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert({ key: "logo", value: JSON.parse(JSON.stringify(newSettings)) });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logo-settings"] });
      toast.success("Pengaturan logo berhasil disimpan!");
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

    // Validate file size (max 2MB for logo)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("hero-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("hero-images")
        .getPublicUrl(fileName);

      const newUrl = urlData.publicUrl;
      setPreviewUrl(newUrl);
      setSettings((prev) => ({ ...prev, logo_url: newUrl, logo_type: "upload" }));
      toast.success("Logo berhasil diupload!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error("Gagal mengupload logo: " + errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setSettings((prev) => ({ ...prev, logo_url: url, logo_type: "url" }));
    setPreviewUrl(url);
  };

  const handleImageTypeChange = (type: "default" | "url" | "upload") => {
    setSettings((prev) => ({ ...prev, logo_type: type }));
    if (type === "default") {
      setPreviewUrl("");
      setSettings((prev) => ({ ...prev, logo_url: "" }));
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
        <h2 className="text-2xl font-bold text-foreground">Pengaturan Logo Daerah</h2>
        <p className="text-muted-foreground">Sesuaikan logo dan nama situs di header</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Text Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Situs</CardTitle>
            <CardDescription>Sesuaikan nama dan subtitle situs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_name">Nama Situs</Label>
              <Input
                id="site_name"
                value={settings.site_name}
                onChange={(e) => setSettings((prev) => ({ ...prev, site_name: e.target.value }))}
                placeholder="Program Agro Mopomulo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site_subtitle">Subtitle</Label>
              <Input
                id="site_subtitle"
                value={settings.site_subtitle}
                onChange={(e) => setSettings((prev) => ({ ...prev, site_subtitle: e.target.value }))}
                placeholder="Kabupaten Gorontalo Utara"
              />
            </div>
          </CardContent>
        </Card>

        {/* Logo Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Logo Daerah</CardTitle>
            <CardDescription>Pilih sumber logo untuk header situs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={settings.logo_type}
              onValueChange={(value) => handleImageTypeChange(value as "default" | "url" | "upload")}
              className="grid grid-cols-1 gap-3"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="default" id="logo-default" />
                <Label htmlFor="logo-default" className="flex items-center gap-2 cursor-pointer">
                  <ImageIcon className="w-4 h-4" />
                  Icon Default (TreePine)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="url" id="logo-url" />
                <Label htmlFor="logo-url" className="flex items-center gap-2 cursor-pointer">
                  <Link className="w-4 h-4" />
                  Link URL
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="upload" id="logo-upload" />
                <Label htmlFor="logo-upload" className="flex items-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload File
                </Label>
              </div>
            </RadioGroup>

            {settings.logo_type === "url" && (
              <div className="space-y-2">
                <Label htmlFor="logo_url">URL Logo</Label>
                <Input
                  id="logo_url"
                  type="url"
                  value={settings.logo_url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            )}

            {settings.logo_type === "upload" && (
              <div className="space-y-2">
                <Label htmlFor="logo_file_upload">Upload Logo</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="logo_file_upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="max-w-sm"
                  />
                  {uploading && <Loader2 className="w-5 h-5 animate-spin" />}
                </div>
                <p className="text-sm text-muted-foreground">Format: JPG, PNG, WebP, SVG. Maksimal 2MB.</p>
              </div>
            )}

            {/* Preview */}
            {(settings.logo_type !== "default" && previewUrl) && (
              <div className="space-y-2">
                <Label>Preview Logo</Label>
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 flex items-center justify-center bg-white">
                    <img
                      src={previewUrl}
                      alt="Logo Preview"
                      className="w-10 h-10 object-contain"
                      onError={() => setPreviewUrl("")}
                    />
                  </div>
                  <div className="leading-tight">
                    <p className="font-semibold text-sm">{settings.site_name}</p>
                    <p className="text-xs text-muted-foreground">{settings.site_subtitle}</p>
                  </div>
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

export default LogoSettings;
