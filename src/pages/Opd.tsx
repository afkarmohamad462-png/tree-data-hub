import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2, Users, TreePine, Target } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";

interface OPDStats {
    id: string;
    name: string;
    personnel_count: number;
    tree_target_per_person: number;
    total_target: number;
    trees_planted: number;
    participants: number;
    participation_percentage: number;
    completion_percentage: number;
}

export default function KontribusiOPD() {
    const [stats, setStats] = useState<OPDStats[]>([]);
    const [selectedOpd, setSelectedOpd] = useState<OPDStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);

        const { data: opdData } = await supabase
            .from("opd")
            .select("*")
            .order("name");

        const { data: registrations } = await supabase
            .from("tree_registrations")
            .select("opd_id, tree_count, email");

        if (!opdData || !registrations) {
            setLoading(false);
            return;
        }

        const result: OPDStats[] = opdData.map((opd: any) => {
            const rows = registrations.filter((r: any) => r.opd_id === opd.id);
            const trees = rows.reduce((s: number, r: any) => s + r.tree_count, 0);
            const participants = new Set(rows.map((r: any) => r.email)).size;
            const target = opd.personnel_count * opd.tree_target_per_person;

            return {
                id: opd.id,
                name: opd.name,
                personnel_count: opd.personnel_count,
                tree_target_per_person: opd.tree_target_per_person,
                total_target: target,
                trees_planted: trees,
                participants,
                completion_percentage: target ? Math.round((trees / target) * 100) : 0,
                participation_percentage: opd.personnel_count
                    ? Math.round((participants / opd.personnel_count) * 100)
                    : 0,
            };
        });

        setStats(result);
        setLoading(false);
    };

    // hanya OPD yang sudah ada kontribusi penanaman
    const contributedStats = stats.filter(o => o.trees_planted > 0);

    const chartData = contributedStats.map(o => ({
        opd: o.name,
        pohon: o.trees_planted,
        target: o.total_target,
        progres: o.completion_percentage,
        partisipan: o.participants,
    }));

    if (loading) return <p className="text-center">Memuat data...</p>;

    return (
        <div className="space-y-6">
            <Card className="border-0 shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        Kontribusi OPD dalam Penanaman Pohon
                    </CardTitle>
                </CardHeader>

                <CardContent className="h-[520px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 20, left: 20, bottom: 90 }}
                        >
                            <XAxis
                                dataKey="opd"
                                interval={0}
                                angle={-30}
                                textAnchor="end"
                                height={90}
                            />
                            <YAxis />
                            <Tooltip
                                formatter={(value: number, _: any, item: any) => {
                                    const d = item.payload;
                                    return [
                                        `${value} pohon`,
                                        `Partisipan: ${d.partisipan} orang • Target: ${d.target}`
                                    ];
                                }}
                            />
                            <Legend />

                            <Bar
                                dataKey="pohon"
                                name="Jumlah Pohon Tertanam"
                                radius={[6, 6, 0, 0]}
                                onClick={(_, index) => setSelectedOpd(contributedStats[index])}
                            >
                                {chartData.map((o, i) => (
                                    <Cell
                                        key={i}
                                        fill={
                                            o.progres < 50
                                                ? "#ef4444" // merah
                                                : o.progres < 70
                                                    ? "#facc15" // kuning
                                                    : "#22c55e" // hijau
                                        }
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Dialog open={!!selectedOpd} onOpenChange={() => setSelectedOpd(null)}>
                {selectedOpd && (
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>{selectedOpd.name}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="flex items-center gap-2">
                                    <TreePine className="w-4 h-4" /> Pohon tertanam
                                </span>
                                <strong>
                                    {selectedOpd.trees_planted} / {selectedOpd.total_target}
                                </strong>
                            </div>

                            <div className="flex justify-between">
                                <span className="flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Personil berpartisipasi
                                </span>
                                <strong>
                                    {selectedOpd.participants} / {selectedOpd.personnel_count}
                                </strong>
                            </div>

                            <div className="flex justify-between">
                                <span className="flex items-center gap-2">
                                    <Target className="w-4 h-4" /> Target / Orang
                                </span>
                                <strong>{selectedOpd.tree_target_per_person}</strong>
                            </div>

                            <div className="pt-2 text-muted-foreground">
                                Pencapaian Target: {selectedOpd.completion_percentage}%
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}
