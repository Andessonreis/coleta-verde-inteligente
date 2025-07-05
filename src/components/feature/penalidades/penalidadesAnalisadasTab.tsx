"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye } from "lucide-react"
import type { Penalidade } from "@/types/penalidade"
import { getTipoText, getStatusColor, getStatusText } from "@/utils/penalidadeUtils"

interface PenalidadesAnalisadasTabProps {
  penalidades: Penalidade[]
  onVisualizarPenalidade: (penalidade: Penalidade) => void
}

export function PenalidadesAnalisadasTab({ penalidades, onVisualizarPenalidade }: PenalidadesAnalisadasTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Penalidades Analisadas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data Reporte</TableHead>
              <TableHead>Data Análise</TableHead>
              <TableHead>Cidadão</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Analista</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {penalidades.map((penalidade) => (
              <TableRow key={penalidade.id}>
                <TableCell>{new Date(penalidade.dataReporte).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>
                  {penalidade.dataAnalise ? new Date(penalidade.dataAnalise).toLocaleDateString("pt-BR") : "-"}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{penalidade.cidadao.name}</div>
                    <div className="text-sm text-gray-500">{penalidade.cidadao.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{getTipoText(penalidade.tipo)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(penalidade.status)}>{getStatusText(penalidade.status)}</Badge>
                </TableCell>
                <TableCell>{penalidade.analista?.nome || "-"}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => onVisualizarPenalidade(penalidade)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
