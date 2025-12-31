import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TreePine, Filter, MapPin } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Registration {
  id: string;
  email: string;
  full_name: string;
  gender: string;
  address: string;
  whatsapp: string;
  opd_id: string | null;
  tree_count: number;
  tree_type: string;
  tree_category: string;
  latitude: number | null;
  longitude: number | null;
  photo_url: string | null;
  created_at: string;
  opd?: { name: string } | null;
}

interface OPD {
  id: string;
  name: string;
}

const TreeRegistrationsList = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [opdList, setOpdList] = useState<OPD[]>([]);
  const [selectedOPD, setSelectedOPD] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOPDList();
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [selectedOPD]);

  const fetchOPDList = async () => {
    const { data, error } = await supabase
      .from('opd')
      .select('id, name')
      .order('name');

    if (!error && data) {
      setOpdList(data);
    }
  };

  const fetchRegistrations = async () => {
    setIsLoading(true);
    
    let query = supabase
      .from('tree_registrations')
      .select(`
        *,
        opd:opd_id (name)
      `)
      .order('created_at', { ascending: false });

    if (selectedOPD !== "all") {
      query = query.eq('opd_id', selectedOPD);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching registrations:', error);
    } else {
      setRegistrations(data || []);
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="border-0 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <TreePine className="w-5 h-5 text-primary" />
          Data Pendaftaran Pohon
        </CardTitle>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedOPD} onValueChange={setSelectedOPD}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter OPD" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua OPD</SelectItem>
              {opdList.map((opd) => (
                <SelectItem key={opd.id} value={opd.id}>
                  {opd.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <TreePine className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada data pendaftaran pohon</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>OPD</TableHead>
                  <TableHead>Jenis Pohon</TableHead>
                  <TableHead className="text-center">Jumlah</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Lokasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(reg.created_at), "dd MMM yyyy", { locale: id })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{reg.full_name}</p>
                        <p className="text-xs text-muted-foreground">{reg.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {reg.opd?.name || "Tidak diketahui"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="capitalize">{reg.tree_type}</p>
                        <p className="text-xs text-muted-foreground capitalize">{reg.tree_category}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-primary">{reg.tree_count}</span>
                    </TableCell>
                    <TableCell className="text-sm">{reg.whatsapp}</TableCell>
                    <TableCell>
                      {reg.latitude && reg.longitude ? (
                        <a
                          href={`https://maps.google.com/?q=${reg.latitude},${reg.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline text-sm"
                        >
                          <MapPin className="w-3 h-3" />
                          Lihat
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TreeRegistrationsList;
