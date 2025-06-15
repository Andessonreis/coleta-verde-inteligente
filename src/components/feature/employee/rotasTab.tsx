import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Package,
  CheckCircle,
  Clock,
  AlertTriangle,
  Route,
} from "lucide-react"
import { ColetaCard } from "@/components/feature/employee/coletaCard"
import { StatusCard } from "@/components/feature/employee/statusCard"
import { ColetaRota } from "@/types"

type RotasTabProps = {
  coletas: ColetaRota[]
  onAtualizarStatus: (id: string, status: ColetaRota["status"], observacoes?: string) => void
  onReportarProblema: (coleta: ColetaRota) => void
}

export function RotasTab({
  coletas,
  onAtualizarStatus,
  onReportarProblema,
}: RotasTabProps) {
  const estatisticas = {
    total: coletas.length,
    concluidas: coletas.filter((c) => c.status === "concluida").length,
    pendentes: coletas.filter((c) => c.status === "pendente").length,
    problemas: coletas.filter((c) => c.status === "problema").length,
  }

  return (
    <div className="space-y-6">
      {/* Resumo do dia */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <StatusCard
          icon={Package}
          valor={estatisticas.total}
          label="Coletas Hoje"
          cor="green"
        />
        <StatusCard
          icon={CheckCircle}
          valor={estatisticas.concluidas}
          label="Concluídas"
          cor="green"
        />
        <StatusCard
          icon={Clock}
          valor={estatisticas.pendentes}
          label="Pendentes"
          cor="blue"
        />
        <StatusCard
          icon={AlertTriangle}
          valor={estatisticas.problemas}
          label="Problemas"
          cor="red"
        />
      </div>

      {/* Lista de coletas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Rota de Coletas 
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-4">
          <div className="space-y-4">
            {coletas.map((coleta) => (
              <ColetaCard
                key={coleta.id}
                coleta={coleta}
                onIniciar={() =>
                  onAtualizarStatus(coleta.id, "em_andamento")
                }
                onConcluir={() =>
                  onAtualizarStatus(coleta.id, "concluida")
                }
                onReportarProblema={() => onReportarProblema(coleta)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
