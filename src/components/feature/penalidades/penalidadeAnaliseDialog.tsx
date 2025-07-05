"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertTriangle, CheckCircle, XCircle, User, Clock, Camera } from "lucide-react"
import type { Penalidade } from "@/types/penalidade"
import { getTipoText, getStatusColor, getStatusText } from "@/utils/penalidadeUtils"

interface PenalidadeAnaliseDialogProps {
  open: boolean
  penalidade: Penalidade
  onClose: () => void
  onConfirmarAnalise: (aprovada: boolean, observacoes: string) => void
}

export function PenalidadeAnaliseDialog({
  open,
  penalidade,
  onClose,
  onConfirmarAnalise,
}: PenalidadeAnaliseDialogProps) {
  const [observacoesAnalise, setObservacoesAnalise] = useState("")
  const [tipoDecisao, setTipoDecisao] = useState<"aprovar" | "rejeitar" | null>(null)

  const handleDecisao = (decisao: "aprovar" | "rejeitar") => {
    setTipoDecisao(decisao)
  }

  const handleConfirmar = () => {
    if (!tipoDecisao || !observacoesAnalise.trim()) {
      alert("Preencha todos os campos obrigatórios.")
      return
    }

    onConfirmarAnalise(tipoDecisao === "aprovar", observacoesAnalise)

    // Reset form
    setObservacoesAnalise("")
    setTipoDecisao(null)
  }

  const handleClose = () => {
    setObservacoesAnalise("")
    setTipoDecisao(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="!max-w-none w-[50vw] max-h-[90vh] overflow-y-auto !p-0">
        <div className="p-6">
          <DialogHeader className="pb-6 border-b">
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              Análise de Penalidade
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Analise cuidadosamente todas as evidências antes de tomar uma decisão.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-10 py-8">
            {/* Header com informações principais */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-700">
                    <User className="h-4 w-4" />
                    <span className="font-medium text-sm">Cidadão</span>
                  </div>
                  <div>
                    <p className="font-bold text-base text-gray-800">{penalidade.cidadao.name}</p>
                    <p className="text-sm text-gray-600">{penalidade.cidadao.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium text-sm">Data do Reporte</span>
                  </div>
                  <div>
                    <p className="font-bold text-base text-gray-800">
                      {new Date(penalidade.dataReporte).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(penalidade.dataReporte).toLocaleTimeString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-700">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium text-sm">Tipo de Problema</span>
                  </div>
                  <div>
                    <Badge className="text-sm px-3 py-1 bg-orange-100 text-orange-800 border-orange-200">
                      {getTipoText(penalidade.tipo)}
                    </Badge>
                    <p className="text-sm text-red-600 font-semibold mt-1">Bloqueio: {penalidade.diasBloqueio} dias</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Funcionário responsável */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-gray-600" />
                  Funcionário Responsável
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg text-gray-800">{penalidade.funcionario.nome}</p>
                    <p className="text-gray-600">Registro: {penalidade.funcionario.registration}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Descrição do Problema */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <CardTitle className="text-lg">Descrição Detalhada do Problema</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-white border-l-4 border-orange-400 pl-6 py-4">
                  <p className="text-gray-800 leading-relaxed text-base">{penalidade.descricao}</p>
                </div>
              </CardContent>
            </Card>

            {/* Evidência Fotográfica */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Camera className="h-5 w-5 text-gray-600" />
                  Evidência Fotográfica
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-gray-100 rounded-xl p-4">
{/*                   <img
                    src={penalidade.fotoEvidencia || "/placeholder.svg"}
                    alt="Evidência do problema"
                    className="w-full max-w-4xl mx-auto h-96 object-cover rounded-lg shadow-md border"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=320&width=600"
                    }}
                  /> */}
                </div>
              </CardContent>
            </Card>

            {/* Seção de Análise (apenas se pendente) */}
            {penalidade.status === "PENDING_ANALYSIS" && (
              <Card className="shadow-lg border-0 border-t-4 border-t-amber-400">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
                  <CardTitle className="text-xl text-amber-800">Sua Análise</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  {/* Botões de Decisão */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold text-gray-700">Decisão sobre a Penalidade</Label>
                    <div className="grid lg:grid-cols-2 gap-4">
                      <Button
                        size="lg"
                        variant={tipoDecisao === "aprovar" ? "default" : "outline"}
                        onClick={() => handleDecisao("aprovar")}
                        className={`h-16 text-base ${
                          tipoDecisao === "aprovar"
                            ? "bg-red-600 hover:bg-red-700 shadow-lg"
                            : "border-2 hover:border-red-300 hover:bg-red-50"
                        }`}
                      >
                        <CheckCircle className="h-5 w-5 mr-3" />
                        Aprovar Penalidade
                      </Button>
                      <Button
                        size="lg"
                        variant={tipoDecisao === "rejeitar" ? "default" : "outline"}
                        onClick={() => handleDecisao("rejeitar")}
                        className={`h-16 text-base ${
                          tipoDecisao === "rejeitar"
                            ? "bg-green-600 hover:bg-green-700 shadow-lg"
                            : "border-2 hover:border-green-300 hover:bg-green-50"
                        }`}
                      >
                        <XCircle className="h-5 w-5 mr-3" />
                        Rejeitar Penalidade
                      </Button>
                    </div>
                  </div>

                  {/* Campo de Observações */}
                  <div className="space-y-3">
                    <Label htmlFor="observacoes" className="text-base font-semibold text-gray-700">
                      Justificativa da Decisão <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="observacoes"
                      placeholder="Descreva detalhadamente os motivos da sua decisão, baseando-se nas evidências apresentadas..."
                      value={observacoesAnalise}
                      onChange={(e) => setObservacoesAnalise(e.target.value)}
                      rows={6}
                      className="resize-none text-base p-4 border-2 focus:border-blue-400"
                    />
                  </div>

                  {/* Alertas de Consequências */}
                  {tipoDecisao === "aprovar" && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-red-800 text-lg mb-2">⚠️ Atenção: Penalidade Será Aplicada</h4>
                          <p className="text-red-700 leading-relaxed">
                            Ao aprovar esta penalidade, o cidadão será{" "}
                            <strong>automaticamente bloqueado por {penalidade.diasBloqueio} dias</strong> e receberá uma
                            notificação por email. Esta ação não pode ser desfeita.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {tipoDecisao === "rejeitar" && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-green-800 text-lg mb-2">✅ Penalidade Será Rejeitada</h4>
                          <p className="text-green-700 leading-relaxed">
                            Ao rejeitar esta penalidade, <strong>nenhuma ação será tomada contra o cidadão</strong>. O
                            funcionário será notificado sobre a decisão.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Resultado da Análise (se já analisada) */}
            {penalidade.status !== "PENDING_ANALYSIS" && (
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gray-50 rounded-t-lg">
                  <CardTitle className="text-xl">Resultado da Análise</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Status</span>
                        <div className="mt-1">
                          <Badge className={`${getStatusColor(penalidade.status)} text-base px-3 py-1`}>
                            {getStatusText(penalidade.status)}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                          Data da Análise
                        </span>
                        <p className="text-base font-medium text-gray-800 mt-1">
                          {penalidade.dataAnalise ? new Date(penalidade.dataAnalise).toLocaleString("pt-BR") : "-"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Analista</span>
                        <p className="text-base font-medium text-gray-800 mt-1">{penalidade.analista?.nome || "-"}</p>
                      </div>
                      {penalidade.status === "APPROVED" && (
                        <div>
                          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            Período de Bloqueio
                          </span>
                          <p className="text-base font-bold text-red-600 mt-1">
                            {penalidade.dataInicioBloqueio && penalidade.dataFimBloqueio
                              ? `${new Date(penalidade.dataInicioBloqueio).toLocaleDateString("pt-BR")} até ${new Date(penalidade.dataFimBloqueio).toLocaleDateString("pt-BR")}`
                              : "Não definido"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Observações do Analista
                    </span>
                    <div className="mt-2 bg-gray-50 rounded-lg p-4 border-l-4 border-blue-400">
                      <p className="text-base leading-relaxed text-gray-800">
                        {penalidade.observacoesAnalista || "Nenhuma observação adicional."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter className="pt-6 border-t space-x-4">
            <Button variant="outline" onClick={handleClose} size="lg" className="px-8 bg-transparent">
              {penalidade.status === "PENDING_ANALYSIS" ? "Cancelar" : "Fechar"}
            </Button>
            {penalidade.status === "PENDING_ANALYSIS" && (
              <Button
                onClick={handleConfirmar}
                disabled={!tipoDecisao || !observacoesAnalise.trim()}
                size="lg"
                className={`px-8 ${
                  tipoDecisao === "aprovar" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {tipoDecisao === "aprovar" ? "✅ Confirmar Penalidade" : "❌ Confirmar Rejeição"}
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
