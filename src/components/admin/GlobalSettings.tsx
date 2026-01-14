import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Settings, Save, Loader2, TreePine, Users, Target } from "lucide-react";

interface GlobalSetting {
  id: string;
  key: string;
  value: number;
  label: string;
}

const settingsConfig = {
  display_total_target: {
    icon: Target,
    description: "Target total pohon yang ingin dicapai",
    colorClass: "text-amber"
  },
  display_total_participants: {
    icon: Users,
    description: "Total partisipan yang ditampilkan",
    colorClass: "text-leaf"
  },
  display_total_trees: {
    icon: TreePine,
    description: "Total pohon yang ditampilkan",
    colorClass: "text-primary"
  }
};

const GlobalSettings = () => {
  const [settings, setSettings] = useState<GlobalSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const { data, error } = await (supabase
      .from('global_settings' as any)
      .select('*')
      .order('key') as any);

    if (error) {
      console.error('Error fetching settings:', error);
      toast.error("Gagal memuat pengaturan");
    } else {
      setSettings((data as GlobalSetting[]) || []);
    }
    setIsLoading(false);
  };

  const handleValueChange = (id: string, value: number) => {
    setSettings(prev => 
      prev.map(s => s.id === id ? { ...s, value } : s)
    );
  };

  const saveSetting = async (setting: GlobalSetting) => {
    setIsSaving(setting.id);
    
    const { error } = await supabase
      .from('global_settings' as any)
      .update({ value: setting.value })
      .eq('id', setting.id);

    if (error) {
      console.error('Error saving setting:', error);
      toast.error("Gagal menyimpan pengaturan");
    } else {
      toast.success(`${setting.label} berhasil diperbarui`);
    }
    
    setIsSaving(null);
  };

  const saveAllSettings = async () => {
    setIsSaving('all');
    
    for (const setting of settings) {
      const { error } = await supabase
        .from('global_settings' as any)
        .update({ value: setting.value })
        .eq('id', setting.id);

      if (error) {
        console.error('Error saving setting:', error);
        toast.error(`Gagal menyimpan ${setting.label}`);
        setIsSaving(null);
        return;
      }
    }
    
    toast.success("Semua pengaturan berhasil disimpan");
    setIsSaving(null);
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-card">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Pengaturan Tampilan
        </CardTitle>
        <CardDescription>
          Atur nilai yang akan ditampilkan di dashboard dan halaman utama
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {settings.map((setting) => {
          const config = settingsConfig[setting.key as keyof typeof settingsConfig];
          const Icon = config?.icon || Settings;
          
          return (
            <div 
              key={setting.id} 
              className="p-4 rounded-lg bg-muted/30 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-background ${config?.colorClass || 'text-primary'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <Label className="font-semibold text-foreground">
                    {setting.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {config?.description || "Nilai yang akan ditampilkan"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={setting.value}
                  onChange={(e) => handleValueChange(setting.id, parseInt(e.target.value) || 0)}
                  className="flex-1"
                  min={0}
                />
                <Button 
                  onClick={() => saveSetting(setting)}
                  disabled={isSaving !== null}
                  size="sm"
                >
                  {isSaving === setting.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          );
        })}

        <Button 
          onClick={saveAllSettings}
          disabled={isSaving !== null}
          className="w-full"
        >
          {isSaving === 'all' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Simpan Semua Pengaturan
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GlobalSettings;
