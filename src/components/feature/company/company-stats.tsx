import { Calendar, Clock, CheckCircle2, Recycle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CompanyStatsProps {
  stats: {
    total: number;
    pendentes: number;
    confirmados: number;
    concluidos: number;
    cancelados: number;
  };
}

export function CompanyStats({ stats }: CompanyStatsProps) {
  return (
    <>
      <Card className="border-l-4 border-l-blue-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
          <CardDescription>Este mês</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{stats.total}</div>
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-amber-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          <CardDescription>Aguardando coleta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{stats.pendentes}</div>
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
          <CardDescription>Este mês</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{stats.concluidos}</div>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
