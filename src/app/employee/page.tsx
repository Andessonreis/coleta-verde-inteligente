"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RotasTab } from "@/components/feature/employee/rotasTab"
import { PerfilTab } from "@/components/feature/employee/perfilTab"
import { ProblemaDialog } from "@/components/feature/employee/problemaDialog"
import { useColetas } from "@/hooks/useColetas"
import { useFuncionario } from "@/hooks/useFuncionario"
import { ColetaRota } from "@/types"
import { HeaderFuncionario } from "@/components/feature/employee/headerFuncionario"

export default function FuncionarioPage() {
  const { perfil } = useFuncionario()
  const { coletas, atualizarStatusColeta } = useColetas()

  const [dialogoProblema, setDialogoProblema] = useState(false)
  const [coletaSelecionada, setColetaSelecionada] = useState<ColetaRota | null>(null)

  const handleProblema = (coleta: ColetaRota) => {
    setColetaSelecionada(coleta)
    setDialogoProblema(true)
  }

  const handleSalvarProblema = (observacao: string) => {
    if (coletaSelecionada) {
      atualizarStatusColeta(coletaSelecionada.id, "problema", observacao)
    }
    setDialogoProblema(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <HeaderFuncionario funcionario={perfil?.nome} />

      <Tabs defaultValue="rotas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rotas">Minhas Rotas</TabsTrigger>
          <TabsTrigger value="perfil">Meu Perfil</TabsTrigger>
        </TabsList>

        <TabsContent value="rotas">
          <RotasTab
            coletas={coletas}
            onAtualizarStatus={atualizarStatusColeta}
            onReportarProblema={handleProblema}
          />
        </TabsContent>

        <TabsContent value="perfil">
          {perfil ? <PerfilTab perfil={perfil} /> : <p>Carregando perfil...</p>}
        </TabsContent>
      </Tabs>

      {coletaSelecionada && (
        <ProblemaDialog
          open={dialogoProblema}
          onOpenChange={setDialogoProblema}
          coleta={coletaSelecionada}
          onSalvar={handleSalvarProblema}
        />
      )}
    </div>
  )
}
