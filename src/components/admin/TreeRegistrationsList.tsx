import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TreePine, Filter, MapPin, Users, Building2, Map, FileSpreadsheet, FileText, Download } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "@/hooks/use-toast";

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

  // Statistik dashboard
  const [stats, setStats] = useState({
    totalTrees: 0,
    totalParticipants: 0,
    totalOPD: 0,
    totalLocations: 0,
  });

  useEffect(() => {
    fetchOPDList();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [selectedOPD]);

  const fetchOPDList = async () => {
    const { data, error } = await supabase
      .from("opd")
      .select("id, name")
      .order("name");

    if (!error && data) {
      setOpdList(data);
    }
  };

  const fetchStats = async () => {
    // Ambil data untuk hitung total pohon, partisipan, dan lokasi
    const { data: registrationsData, error } = await supabase
      .from("tree_registrations")
      .select("tree_count, latitude");

    // Hitung total OPD langsung dari tabel opd
    const { count: opdCount } = await supabase
      .from("opd")
      .select("*", { count: "exact", head: true });

    if (!error && registrationsData) {
      const totalTrees = registrationsData.reduce(
        (sum, r) => sum + (r.tree_count || 0),
        0,
      );

      const totalParticipants = registrationsData.length;
      const totalLocations = registrationsData.filter((r) => r.latitude !== null)
        .length;

      setStats({
        totalTrees,
        totalParticipants,
        totalOPD: opdCount || 0,
        totalLocations,
      });
    }
  };

  const fetchRegistrations = async () => {
    setIsLoading(true);

    let query = supabase
      .from("tree_registrations")
      .select(
        `
        *,
        opd:opd_id (name)
      `,
      )
      .order("created_at", { ascending: false });

    if (selectedOPD !== "all") {
      query = query.eq("opd_id", selectedOPD);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching registrations:", error);
    } else {
      setRegistrations(data || []);
    }

    setIsLoading(false);
  };

  // Export ke Excel
  const exportToExcel = () => {
    if (registrations.length === 0) {
      toast({ title: "Tidak ada data", description: "Data kosong untuk di-export", variant: "destructive" });
      return;
    }

    const exportData = registrations.map((reg, index) => ({
      "No": index + 1,
      "Tanggal": format(new Date(reg.created_at), "dd MMM yyyy", { locale: id }),
      "Nama Lengkap": reg.full_name,
      "Email": reg.email,
      "Gender": reg.gender,
      "WhatsApp": reg.whatsapp,
      "Alamat": reg.address,
      "OPD": reg.opd?.name || "-",
      "Jenis Pohon": reg.tree_type,
      "Kategori": reg.tree_category,
      "Jumlah Pohon": reg.tree_count,
      "Latitude": reg.latitude || "-",
      "Longitude": reg.longitude || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pohon");

    // Auto-width columns
    const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
      wch: Math.max(key.length, 15),
    }));
    worksheet["!cols"] = colWidths;

    const fileName = `data-pohon-${format(new Date(), "yyyy-MM-dd")}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast({ title: "Export Berhasil", description: `File ${fileName} telah diunduh` });
  };

  // Export ke PDF
  const exportToPDF = () => {
    if (registrations.length === 0) {
      toast({ title: "Tidak ada data", description: "Data kosong untuk di-export", variant: "destructive" });
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });

    // Header
    doc.setFontSize(16);
    doc.text("Laporan Data Pendaftaran Pohon", 14, 15);
    doc.setFontSize(10);
    doc.text(`Tanggal Export: ${format(new Date(), "dd MMMM yyyy", { locale: id })}`, 14, 22);
    doc.text(`Total Data: ${registrations.length} pendaftaran`, 14, 28);

    const tableData = registrations.map((reg, index) => [
      index + 1,
      format(new Date(reg.created_at), "dd/MM/yy"),
      reg.full_name,
      reg.opd?.name || "-",
      reg.tree_type,
      reg.tree_category,
      reg.tree_count,
      reg.whatsapp,
      reg.latitude && reg.longitude ? `${reg.latitude.toFixed(4)}, ${reg.longitude.toFixed(4)}` : "-",
    ]);

    autoTable(doc, {
      head: [["No", "Tanggal", "Nama", "OPD", "Jenis Pohon", "Kategori", "Jumlah", "Kontak", "Koordinat"]],
      body: tableData,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 139, 34] },
    });

    const fileName = `laporan-pohon-${format(new Date(), "yyyy-MM-dd")}.pdf`;
    doc.save(fileName);

    toast({ title: "Export Berhasil", description: `File ${fileName} telah diunduh` });
  };

  return (
    <div className="space-y-6">
      {/* ====== STAT CARD DASHBOARD ====== */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Pohon</CardTitle>
            <TreePine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTrees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Partisipan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParticipants}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total OPD</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOPD}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Lokasi Tanam</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLocations}</div>
          </CardContent>
        </Card>
      </div>

      {/* ====== CARD UTAMA (TABEL) ====== */}
      <Card className="border-0 shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <TreePine className="w-5 h-5 text-primary" />
            Data Pendaftaran Pohon
          </CardTitle>

          <div className="flex items-center gap-2 flex-wrap">
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

            <div className="flex gap-2 ml-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportToExcel}
                className="gap-1"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span className="hidden sm:inline">Excel</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToPDF}
                className="gap-1"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">PDF</span>
              </Button>
            </div>
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
                        {format(new Date(reg.created_at), "dd MMM yyyy", {
                          locale: id,
                        })}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reg.full_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {reg.email}
                          </p>
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
                          <p className="text-xs text-muted-foreground capitalize">
                            {reg.tree_category}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold text-primary">
                          {reg.tree_count}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {reg.whatsapp}
                      </TableCell>
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
                          <span className="text-muted-foreground text-sm">
                            -
                          </span>
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
    </div>
  );
};

export default TreeRegistrationsList;
