"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Clock, User, AlertTriangle, CheckCircle } from "lucide-react"
import type { Penalidade } from "@/types/penalidade"
import { getTipoText, getTipoColor, getStatusColor, getStatusIcon, formatarData } from "@/utils/penalidadeUtils"

interface PenalidadesPendentesTabProps {
  penalidades: Penalidade[]
  onVisualizarPenalidade: (penalidade: Penalidade) => void
}

export function PenalidadesPendentesTab({ penalidades, onVisualizarPenalidade }: PenalidadesPendentesTabProps) {
  if (penalidades.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhuma penalidade pendente!</h3>
        <p className="text-gray-600">Todas as penalidades foram analisadas.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <h2 className="text-xl font-semibold text-gray-800">Penalidades Aguardando Análise</h2>
        <Badge className="bg-amber-100 text-amber-800">{penalidades.length}</Badge>
      </div>

      <div className="grid gap-4">
        {penalidades.map((penalidade) => (
          <div
            key={penalidade.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-amber-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={getTipoColor(penalidade.tipo)} variant="outline">
                    {getTipoText(penalidade.tipo)}
                  </Badge>
                  <Badge className={getStatusColor(penalidade.status)} variant="outline">
                    {getStatusIcon(penalidade.status)} Pendente
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-semibold text-gray-800">{penalidade.cidadao.name}</p>
                        <p className="text-sm text-gray-600">{penalidade.cidadao.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Reportado em</p>
                        <p className="font-medium text-gray-800">{formatarData(penalidade.dataReporte)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{penalidade.descricao}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    Funcionário: {penalidade.funcionario.nome} ({penalidade.funcionario.registration})
                  </span>
                  <span className="font-semibold text-red-600">Bloqueio: {penalidade.diasBloqueio} dias</span>
                </div>
              </div>

              <div className="ml-6">
                <Button
                  onClick={() => onVisualizarPenalidade(penalidade)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Analisar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
