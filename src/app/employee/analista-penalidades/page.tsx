"use client"

import { useState, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import {
  Leaf,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
} from "lucide-react"
import { usePenalidades } from "@/hooks/usePenalidades"
import type { Penalidade, PenalidadeParcial } from "@/types/penalidade"

export default function AnalistaPenalidadesPage() {
  const { penalidades, loading, analisarPenalidade } = usePenalidades()
  const [penalidadeSelecionada, setPenalidadeSelecionada] = useState<Penalidade | null>(null)
  const [dialogoAnalise, setDialogoAnalise] = useState(false)
  const [observacoesAnalise, setObservacoesAnalise] = useState("")
  const [tipoDecisao, setTipoDecisao] = useState<"aprovar" | "rejeitar" | null>(null)

  // Filtrar penalidades por status
  const penalidadesPendentes = penalidades.filter((p: { status: string }) => p.status === "PENDENTE_ANALISE")
  const penalidadesAnalisadas = penalidades.filter((p): p is Penalidade => p.status !== "PENDENTE_ANALISE")

  const handleVisualizarPenalidade = (penalidade: Penalidade) => {
    setPenalidadeSelecionada(penalidade)
    setObservacoesAnalise("")
    setTipoDecisao(null)
    setDialogoAnalise(true)
  }
  

  const handleDecisao = (decisao: "aprovar" | "rejeitar") => {
    setTipoDecisao(decisao)
  }

  const handleConfirmarAnalise = async () => {
    if (!penalidadeSelecionada || !tipoDecisao || !observacoesAnalise.trim()) {
      alert("Preencha todos os campos obrigatórios.")
      return
    }

    try {
      await analisarPenalidade(
        penalidadeSelecionada.id,
        tipoDecisao === "aprovar",
        observacoesAnalise.trim(),
        "analista_atual", // Em produção, pegar do contexto do usuário
      )

      alert(`Penalidade ${tipoDecisao === "aprovar" ? "aprovada" : "rejeitada"} com sucesso!`)
      setDialogoAnalise(false)
      setPenalidadeSelecionada(null)
    } catch (error) {
      alert("Erro ao processar análise. Tente novamente.")
    }
  }

  const getStatusColor = (status: Penalidade["status"]) => {
    switch (status) {
      case "PENDENTE_ANALISE":
        return "bg-yellow-100 text-yellow-800"
      case "APROVADA":
        return "bg-red-100 text-red-800"
      case "REJEITADA":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: Penalidade["status"]) => {
    switch (status) {
      case "PENDENTE_ANALISE":
        return "Pendente"
      case "APROVADA":
        return "Aprovada"
      case "REJEITADA":
        return "Rejeitada"
      default:
        return status
    }
  }

  const getTipoText = (tipo: Penalidade["tipo"]) => {
    switch (tipo) {
      case "DESCUMPRIMENTO_RESIDUO":
        return "Resíduo Incorreto"
      case "ITEM_NAO_AUTORIZADO":
        return "Item Não Autorizado"
      case "OUTROS":
        return "Outros"
      default:
        return tipo
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando penalidades...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-green-800">Coleta Verde</h1>
          <span className="text-lg text-gray-600">- Análise de Penalidades</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">Analista de Penalidades</span>
        </div>
      </header>

      {/* Dashboard com estatísticas */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="flex items-center p-6">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{penalidadesPendentes.length}</p>
              <p className="text-sm text-gray-600">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">
                {penalidadesAnalisadas.filter((p: { status: string }) => p.status === "APROVADA").length}
              </p>
              <p className="text-sm text-gray-600">Aprovadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <XCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">
                {penalidadesAnalisadas.filter((p: { status: string }) => p.status === "REJEITADA").length}
              </p>
              <p className="text-sm text-gray-600">Rejeitadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{penalidades.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pendentes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pendentes">Pendentes ({penalidadesPendentes.length})</TabsTrigger>
          <TabsTrigger value="analisadas">Analisadas ({penalidadesAnalisadas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Penalidades Pendentes de Análise</CardTitle>
            </CardHeader>
            <CardContent>
              {penalidadesPendentes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Nenhuma penalidade pendente de análise.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Cidadão</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Funcionário</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {penalidadesPendentes.map((penalidade: Penalidade) => (
                      <TableRow key={penalidade.id}>
                        <TableCell>{new Date(penalidade.dataReporte).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{penalidade.cidadao.nome}</div>
                            <div className="text-sm text-gray-500">{penalidade.cidadao.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{getTipoText(penalidade.tipo)}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{penalidade.funcionario.nome}</div>
                            <div className="text-sm text-gray-500">{penalidade.funcionario.registro}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(penalidade.status)}>
                            {getStatusText(penalidade.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleVisualizarPenalidade(penalidade)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Analisar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analisadas" className="space-y-6">
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
                {penalidadesAnalisadas.map((penalidade) => (
                    <TableRow key={penalidade.id}>
                      <TableCell>{new Date(penalidade.dataReporte).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        {penalidade.dataAnalise ? new Date(penalidade.dataAnalise).toLocaleDateString("pt-BR") : "-"}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{penalidade.cidadao.nome}</div>
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
                        <Button size="sm" variant="outline" onClick={() => handleVisualizarPenalidade(penalidade)}>
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
        </TabsContent>
      </Tabs>

      {/* Dialog de Análise */}
      <Dialog open={dialogoAnalise} onOpenChange={setDialogoAnalise}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Análise de Penalidade
            </DialogTitle>
            <DialogDescription>Analise cuidadosamente as evidências antes de tomar uma decisão.</DialogDescription>
          </DialogHeader>

          {penalidadeSelecionada && (
            <div className="grid gap-6 py-4">
              {/* Informações da Penalidade */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Informações do Cidadão
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{penalidadeSelecionada.cidadao.nome}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{penalidadeSelecionada.cidadao.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{penalidadeSelecionada.cidadao.telefone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span className="text-sm">{penalidadeSelecionada.cidadao.endereco}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Detalhes do Reporte
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Data do Reporte:</span>
                      <p className="text-sm">{new Date(penalidadeSelecionada.dataReporte).toLocaleString("pt-BR")}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Funcionário:</span>
                      <p className="text-sm">
                        {penalidadeSelecionada.funcionario.nome} ({penalidadeSelecionada.funcionario.registro})
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Tipo de Problema:</span>
                      <p className="text-sm">
                        <Badge variant="outline">{getTipoText(penalidadeSelecionada.tipo)}</Badge>
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Dias de Bloqueio:</span>
                      <p className="text-sm font-bold text-red-600">{penalidadeSelecionada.diasBloqueio} dias</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Descrição do Problema */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Descrição do Problema</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{penalidadeSelecionada.descricao}</p>
                </CardContent>
              </Card>

              {/* Foto da Evidência */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Evidência Fotográfica</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={penalidadeSelecionada.fotoEvidencia || "/placeholder.svg"}
                      alt="Evidência do problema"
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=256&width=400"
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Análise (apenas se pendente) */}
              {penalidadeSelecionada.status === "PENDENTE_ANALISE" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sua Análise</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4">
                      <Button
                        variant={tipoDecisao === "aprovar" ? "default" : "outline"}
                        onClick={() => handleDecisao("aprovar")}
                        className={tipoDecisao === "aprovar" ? "bg-red-600 hover:bg-red-700" : ""}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprovar Penalidade
                      </Button>
                      <Button
                        variant={tipoDecisao === "rejeitar" ? "default" : "outline"}
                        onClick={() => handleDecisao("rejeitar")}
                        className={tipoDecisao === "rejeitar" ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeitar Penalidade
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="observacoes">
                        Observações da Análise <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="observacoes"
                        placeholder="Justifique sua decisão detalhadamente..."
                        value={observacoesAnalise}
                        onChange={(e) => setObservacoesAnalise(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                    </div>

                    {tipoDecisao === "aprovar" && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-red-800">Atenção: Penalidade Será Aplicada</h4>
                            <p className="text-sm text-red-700 mt-1">
                              Ao aprovar esta penalidade, o cidadão será automaticamente bloqueado por{" "}
                              {penalidadeSelecionada.diasBloqueio} dias e receberá uma notificação por email. Esta ação
                              não pode ser desfeita.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {tipoDecisao === "rejeitar" && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-800">Penalidade Será Rejeitada</h4>
                            <p className="text-sm text-green-700 mt-1">
                              Ao rejeitar esta penalidade, nenhuma ação será tomada contra o cidadão. O funcionário será
                              notificado sobre a decisão.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Resultado da Análise (se já analisada) */}
              {penalidadeSelecionada.status !== "PENDENTE_ANALISE" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resultado da Análise</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      <p className="text-sm">
                        <Badge className={getStatusColor(penalidadeSelecionada.status)}>
                          {getStatusText(penalidadeSelecionada.status)}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Data da Análise:</span>
                      <p className="text-sm">
                        {penalidadeSelecionada.dataAnalise
                          ? new Date(penalidadeSelecionada.dataAnalise).toLocaleString("pt-BR")
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Analista:</span>
                      <p className="text-sm">{penalidadeSelecionada.analista?.nome || "-"}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Observações:</span>
                      <p className="text-sm leading-relaxed">{penalidadeSelecionada.observacoesAnalista || "-"}</p>
                    </div>
                    {penalidadeSelecionada.status === "APROVADA" && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Período de Bloqueio:</span>
                        <p className="text-sm text-red-600">
                          {penalidadeSelecionada.dataInicioBloqueio && penalidadeSelecionada.dataFimBloqueio
                            ? `${new Date(penalidadeSelecionada.dataInicioBloqueio).toLocaleDateString("pt-BR")} até ${new Date(penalidadeSelecionada.dataFimBloqueio).toLocaleDateString("pt-BR")}`
                            : "Não definido"}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoAnalise(false)}>
              {penalidadeSelecionada?.status === "PENDENTE_ANALISE" ? "Cancelar" : "Fechar"}
            </Button>
            {penalidadeSelecionada?.status === "PENDENTE_ANALISE" && (
              <Button
                onClick={handleConfirmarAnalise}
                disabled={!tipoDecisao || !observacoesAnalise.trim()}
                className={
                  tipoDecisao === "aprovar" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }
              >
                {tipoDecisao === "aprovar" ? "Confirmar Penalidade" : "Confirmar Rejeição"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
