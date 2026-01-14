import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TreePine, Users, Target, TrendingUp, Building2 } from "lucide-react";

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

interface GlobalSettings {
  display_total_target: number;
  display_total_participants: number;
  display_total_trees: number;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<OPDStats[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalTrees: 0,
    totalParticipants: 0,
    totalPersonnel: 0,
    totalTarget: 0,
  });
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
    display_total_target: 0,
    display_total_participants: 0,
    display_total_trees: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchGlobalSettings();
  }, []);

  const fetchGlobalSettings = async () => {
    const { data, error } = await (supabase
      .from('global_settings' as any)
      .select('key, value') as any);
    
    if (!error && data) {
      const settingsObj: GlobalSettings = {
        display_total_target: 0,
        display_total_participants: 0,
        display_total_trees: 0,
      };
      (data as { key: string; value: number }[]).forEach((item: { key: string; value: number }) => {
        if (item.key in settingsObj) {
          settingsObj[item.key as keyof GlobalSettings] = item.value;
        }
      });
      setGlobalSettings(settingsObj);
    }
  };

  const fetchStats = async () => {
    setIsLoading(true);
    
    // Fetch OPD data
    const { data: opdData, error: opdError } = await supabase
      .from('opd')
      .select('*')
      .order('name');

    if (opdError) {
      console.error('Error fetching OPD:', opdError);
      setIsLoading(false);
      return;
    }

    // Fetch tree registrations
    const { data: registrations, error: regError } = await supabase
      .from('tree_registrations')
      .select('opd_id, tree_count, email');

    if (regError) {
      console.error('Error fetching registrations:', regError);
      setIsLoading(false);
      return;
    }

    // Calculate stats per OPD
    const opdStats: OPDStats[] = opdData.map(opd => {
      const opdRegistrations = registrations.filter(r => r.opd_id === opd.id);
      const treesPlanted = opdRegistrations.reduce((sum, r) => sum + r.tree_count, 0);
      const uniqueParticipants = new Set(opdRegistrations.map(r => r.email)).size;
      const totalTarget = opd.personnel_count * opd.tree_target_per_person;
      
      return {
        id: opd.id,
        name: opd.name,
        personnel_count: opd.personnel_count,
        tree_target_per_person: opd.tree_target_per_person,
        total_target: totalTarget,
        trees_planted: treesPlanted,
        participants: uniqueParticipants,
        participation_percentage: opd.personnel_count > 0 
          ? Math.min(100, Math.round((uniqueParticipants / opd.personnel_count) * 100))
          : 0,
        completion_percentage: totalTarget > 0 
          ? Math.min(100, Math.round((treesPlanted / totalTarget) * 100))
          : 0,
      };
    });

    setStats(opdStats);

    // Calculate totals
    const totalTrees = registrations.reduce((sum, r) => sum + r.tree_count, 0);
    const totalParticipants = new Set(registrations.map(r => r.email)).size;
    const totalPersonnel = opdData.reduce((sum, o) => sum + o.personnel_count, 0);
    const totalTarget = opdData.reduce((sum, o) => sum + (o.personnel_count * o.tree_target_per_person), 0);

    setTotalStats({
      totalTrees,
      totalParticipants,
      totalPersonnel,
      totalTarget,
    });

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="grid gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-24" />
          </Card>
        ))}
      </div>
    );
  }

  // Use global settings if set, otherwise use calculated values
  const displayTrees = globalSettings.display_total_trees > 0 
    ? globalSettings.display_total_trees 
    : totalStats.totalTrees;
  const displayParticipants = globalSettings.display_total_participants > 0 
    ? globalSettings.display_total_participants 
    : totalStats.totalParticipants;
  const displayTarget = globalSettings.display_total_target > 0 
    ? globalSettings.display_total_target 
    : totalStats.totalTarget;
  const displayPercentage = displayTarget > 0 
    ? Math.round((displayTrees / displayTarget) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-card bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <TreePine className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pohon</p>
                <p className="text-2xl font-bold text-foreground">{displayTrees.toLocaleString()}</p>
                {globalSettings.display_total_trees > 0 && (
                  <p className="text-xs text-muted-foreground">(Aktual: {totalStats.totalTrees.toLocaleString()})</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card bg-gradient-to-br from-leaf/10 to-leaf/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-leaf/20 rounded-xl">
                <Users className="w-6 h-6 text-leaf" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Partisipan</p>
                <p className="text-2xl font-bold text-foreground">{displayParticipants.toLocaleString()}</p>
                {globalSettings.display_total_participants > 0 && (
                  <p className="text-xs text-muted-foreground">(Aktual: {totalStats.totalParticipants.toLocaleString()})</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card bg-gradient-to-br from-amber/10 to-amber/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber/20 rounded-xl">
                <Target className="w-6 h-6 text-amber" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target Total</p>
                <p className="text-2xl font-bold text-foreground">{displayTarget.toLocaleString()}</p>
                {globalSettings.display_total_target > 0 && (
                  <p className="text-xs text-muted-foreground">(Aktual: {totalStats.totalTarget.toLocaleString()})</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card bg-gradient-to-br from-sky/10 to-sky/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-sky/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-sky" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pencapaian</p>
                <p className="text-2xl font-bold text-foreground">{displayPercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OPD Progress Cards */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Progress per OPD
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {stats.map((opd) => (
            <div key={opd.id} className="space-y-3 p-4 rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">{opd.name}</h4>
                <span className="text-sm text-muted-foreground">
                  {opd.trees_planted} / {opd.total_target} pohon
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pencapaian Target</span>
                    <span className="font-medium text-primary">{opd.completion_percentage}%</span>
                  </div>
                  <Progress value={opd.completion_percentage} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Partisipasi Personil</span>
                    <span className="font-medium text-leaf">{opd.participation_percentage}%</span>
                  </div>
                  <Progress value={opd.participation_percentage} className="h-2 [&>div]:bg-leaf" />
                </div>
              </div>
              
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>Personil: {opd.personnel_count}</span>
                <span>Partisipan: {opd.participants}</span>
                <span>Target/Orang: {opd.tree_target_per_person}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
