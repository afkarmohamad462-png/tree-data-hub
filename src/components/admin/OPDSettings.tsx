import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Building2, Users, Target, Save, Plus, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface OPD {
  id: string;
  name: string;
  personnel_count: number;
  tree_target_per_person: number;
}

const OPDSettings = () => {
  const [opdList, setOpdList] = useState<OPD[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newOPD, setNewOPD] = useState({ name: "", personnel_count: 0, tree_target_per_person: 5 });

  useEffect(() => {
    fetchOPDList();
  }, []);

  const fetchOPDList = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('opd')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching OPD:', error);
      toast.error("Gagal memuat data OPD");
    } else {
      setOpdList(data || []);
    }
    setIsLoading(false);
  };

  const updateOPD = async (opd: OPD) => {
    setIsSaving(opd.id);
    
    const { error } = await supabase
      .from('opd')
      .update({
        personnel_count: opd.personnel_count,
        tree_target_per_person: opd.tree_target_per_person,
      })
      .eq('id', opd.id);

    if (error) {
      console.error('Error updating OPD:', error);
      toast.error("Gagal menyimpan perubahan");
    } else {
      toast.success("Pengaturan berhasil disimpan");
    }
    
    setIsSaving(null);
  };

  const handleFieldChange = (id: string, field: keyof OPD, value: number) => {
    setOpdList(prev => 
      prev.map(opd => 
        opd.id === id ? { ...opd, [field]: value } : opd
      )
    );
  };

  const addNewOPD = async () => {
    if (!newOPD.name.trim()) {
      toast.error("Nama OPD tidak boleh kosong");
      return;
    }

    setIsAddingNew(true);
    
    const { error } = await supabase
      .from('opd')
      .insert({
        name: newOPD.name,
        personnel_count: newOPD.personnel_count,
        tree_target_per_person: newOPD.tree_target_per_person,
      });

    if (error) {
      if (error.code === '23505') {
        toast.error("OPD dengan nama tersebut sudah ada");
      } else {
        console.error('Error adding OPD:', error);
        toast.error("Gagal menambahkan OPD");
      }
    } else {
      toast.success("OPD berhasil ditambahkan");
      setNewOPD({ name: "", personnel_count: 0, tree_target_per_person: 5 });
      fetchOPDList();
    }
    
    setIsAddingNew(false);
  };

  const deleteOPD = async (id: string, name: string) => {
    const confirmed = window.confirm(`Yakin ingin menghapus "${name}"?`);
    if (!confirmed) return;

    const { error } = await supabase
      .from('opd')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting OPD:', error);
      toast.error("Gagal menghapus OPD");
    } else {
      toast.success("OPD berhasil dihapus");
      fetchOPDList();
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-32" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Pengaturan OPD
            </CardTitle>
            <CardDescription>
              Atur jumlah personil dan target pohon per OPD
            </CardDescription>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Tambah OPD
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah OPD Baru</DialogTitle>
                <DialogDescription>
                  Tambahkan organisasi perangkat daerah baru
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nama OPD</Label>
                  <Input
                    placeholder="Nama OPD"
                    value={newOPD.name}
                    onChange={(e) => setNewOPD({ ...newOPD, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Jumlah Personil</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newOPD.personnel_count}
                      onChange={(e) => setNewOPD({ ...newOPD, personnel_count: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Target per Orang</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newOPD.tree_target_per_person}
                      onChange={(e) => setNewOPD({ ...newOPD, tree_target_per_person: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addNewOPD} disabled={isAddingNew}>
                  {isAddingNew ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Tambah
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {opdList.map((opd) => (
            <div
              key={opd.id}
              className="p-4 rounded-lg border border-border bg-card hover:shadow-soft transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-foreground">{opd.name}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => deleteOPD(opd.id, opd.name)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    Jumlah Personil
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={opd.personnel_count}
                    onChange={(e) => handleFieldChange(opd.id, 'personnel_count', parseInt(e.target.value) || 0)}
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    Target per Orang
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={opd.tree_target_per_person}
                    onChange={(e) => handleFieldChange(opd.id, 'tree_target_per_person', parseInt(e.target.value) || 1)}
                    className="h-10"
                  />
                </div>
                
                <div className="flex items-end">
                  <Button
                    onClick={() => updateOPD(opd)}
                    disabled={isSaving === opd.id}
                    className="w-full"
                  >
                    {isSaving === opd.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Simpan
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Total Target: <span className="font-semibold text-foreground">
                    {opd.personnel_count * opd.tree_target_per_person} pohon
                  </span>
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default OPDSettings;
