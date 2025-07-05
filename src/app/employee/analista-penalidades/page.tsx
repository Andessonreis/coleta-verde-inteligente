"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Leaf, Shield, Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePenalidades } from "@/hooks/usePenalidades"
import type { Penalidade } from "@/types/penalidade"
import { PenalidadesDashboard } from "@/components/feature/penalidades/penalidadesDashboard"
import { PenalidadesPendentesTab } from "@/components/feature/penalidades/penalidadesPendentesTab"
import { PenalidadesAnalisadasTab } from "@/components/feature/penalidades/penalidadesAnalisadasTab"
import { PenalidadeAnaliseDialog } from "@/components/feature/penalidades/penalidadeAnaliseDialog"

export default function AnalistaPenalidadesPage() {
  const { penalidades, loading, analisarPenalidade, criarPenalidade } = usePenalidades()
  const [penalidadeSelecionada, setPenalidadeSelecionada] = useState<Penalidade | null>(null)
  const [dialogoAnalise, setDialogoAnalise] = useState(false)
  const [dialogoCriar, setDialogoCriar] = useState(false)

  // Filtrar penalidades por status

  const penalidadesPendentes = penalidades.filter((p: { status: string }) => p.status === "PENDING_ANALYSIS")
  const penalidadesAnalisadas = penalidades.filter((p): p is Penalidade => p.status !== "PENDING_ANALYSIS")


  const handleVisualizarPenalidade = (penalidade: Penalidade) => {
    setPenalidadeSelecionada(penalidade)
    setDialogoAnalise(true)
  }

  const handleFecharDialog = () => {
    setDialogoAnalise(false)
    setPenalidadeSelecionada(null)
  }

  const handleConfirmarAnalise = async (aprovada: boolean, observacoes: string) => {
    if (!penalidadeSelecionada) return;

    try {
      // Chamada correta com apenas 3 argumentos
      await analisarPenalidade(
        penalidadeSelecionada.id,
        aprovada,
        observacoes.trim()
      );

      alert(`Penalidade ${aprovada ? "aprovada" : "rejeitada"} com sucesso!`);
      handleFecharDialog();
    } catch (error) {
      alert("Erro ao processar análise. Tente novamente.");
    }
};
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Carregando penalidades...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Moderno */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-xl">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Coleta Verde
                </h1>
                <p className="text-gray-600 font-medium">Sistema de Análise de Penalidades</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Analista de Penalidades</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <PenalidadesDashboard
          penalidadesPendentes={penalidadesPendentes}
          penalidadesAnalisadas={penalidadesAnalisadas}
          totalPenalidades={penalidades.length}
        />

        {/* Tabs com Design Moderno */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <Tabs defaultValue="pendentes" className="w-full">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-white shadow-sm">
                <TabsTrigger
                  value="pendentes"
                  className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800"
                >
                  🔍 Pendentes ({penalidadesPendentes.length})
                </TabsTrigger>
                <TabsTrigger
                  value="analisadas"
                  className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
                >
                  ✅ Analisadas ({penalidadesAnalisadas.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="pendentes" className="p-6">
              <PenalidadesPendentesTab
                penalidades={penalidadesPendentes}
                onVisualizarPenalidade={handleVisualizarPenalidade}
              />
            </TabsContent>

            <TabsContent value="analisadas" className="p-6">
              <PenalidadesAnalisadasTab
                penalidades={penalidadesAnalisadas}
                onVisualizarPenalidade={handleVisualizarPenalidade}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Dialogs */}
        {penalidadeSelecionada && (
          <PenalidadeAnaliseDialog
            open={dialogoAnalise}
            penalidade={penalidadeSelecionada}
            onClose={handleFecharDialog}
            onConfirmarAnalise={handleConfirmarAnalise}
          />
        )}

      </div>
    </div>
  )
}
