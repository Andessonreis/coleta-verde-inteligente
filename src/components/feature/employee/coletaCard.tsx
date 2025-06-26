"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Phone, CheckCircle, AlertTriangle } from "lucide-react"
import { getStatusColor, getStatusText } from "@/utils/statusUtils"
import type { ColetaRota } from "@/types"
import { NavigationDialog } from "./navigation-dialog"

type ColetaCardProps = {
  coleta: ColetaRota
  onIniciar: () => void
  onConcluir: () => void
  onReportarProblema: () => void
}

export function ColetaCard({ coleta, onIniciar, onConcluir, onReportarProblema }: ColetaCardProps) {
  const [showNavigationDialog, setShowNavigationDialog] = useState(false)

  return (
    <>
      <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <ColetaInfo coleta={coleta} />
          <ColetaActions
            coleta={coleta}
            onIniciar={onIniciar}
            onConcluir={onConcluir}
            onReportarProblema={onReportarProblema}
            onNavigate={() => setShowNavigationDialog(true)}
          />
        </div>
      </div>

      <NavigationDialog
        isOpen={showNavigationDialog}
        onClose={() => setShowNavigationDialog(false)}
        address={coleta.endereco}
        coordinates={coleta.coordenadas}
        title={`Navegar para ${coleta.cidadao.nome}`}
      />
    </>
  )
}

function ColetaInfo({ coleta }: { coleta: ColetaRota }) {
  return (
    <div className="flex-1">
      <div className="flex items-center flex-wrap gap-2 mb-2">
        <Badge className={getStatusColor(coleta.status)}>{getStatusText(coleta.status)}</Badge>
        <span className="text-sm font-medium">{coleta.horarioAgendado}</span>
        <span className="text-sm text-gray-600">- {coleta.tipoResiduo}</span>
      </div>

      <div className="flex items-center gap-1 mb-2 text-sm text-gray-700">
        <MapPin className="h-4 w-4 text-gray-500" />
        <span>{coleta.endereco}</span>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <span>Cidadão: {coleta.cidadao.nome}</span>
        <span className="flex items-center gap-1">
          <Phone className="h-3 w-3" />
          {coleta.cidadao.telefone}
        </span>
      </div>

      {coleta.observacoes && (
        <div className="mt-2 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
          <strong>Observação:</strong> {coleta.observacoes}
        </div>
      )}
    </div>
  )
}

function ColetaActions({
  coleta,
  onIniciar,
  onConcluir,
  onReportarProblema,
  onNavigate,
}: ColetaCardProps & { onNavigate: () => void }) {
  return (
    <div className="flex flex-col gap-2 w-full md:w-auto">
      <Button size="sm" variant="outline" className="justify-start" onClick={onNavigate}>
        <Navigation className="h-4 w-4 mr-1" />
        Navegar
      </Button>

      {coleta.status === "pendente" && (
        <Button size="sm" onClick={onIniciar} className="bg-blue-600 hover:bg-blue-700 text-white">
          Iniciar
        </Button>
      )}

      {coleta.status === "em_andamento" && (
        <Button size="sm" onClick={onConcluir} className="bg-green-600 hover:bg-green-700 text-white">
          <CheckCircle className="h-4 w-4 mr-1" />
          Concluir
        </Button>
      )}

      {(coleta.status === "pendente" || coleta.status === "em_andamento") && (
        <Button size="sm" variant="outline" onClick={onReportarProblema} className="text-red-600 hover:text-red-700">
          <AlertTriangle className="h-4 w-4 mr-1" />
          Problema
        </Button>
      )}
    </div>
  )
}