"use client"

import { useState, useEffect } from "react"
import AppointmentList from "@/components/feature/appointment/appointmentList"
import AppointmentModal from "@/components/feature/appointment/appointmentModal"
import Navbar from "@/components/ui/navbar"
import { fetchCitizenMe } from "@/http/routes/citizens/me"
import { fetchCitizenAppointments } from "@/http/routes/appointments/citizen"
import { getStatusColor, statusOptions, type StatusAgendamentoValue } from "@/types/statusOptions"
import {
  formatDate,
  formatarTelefone,
  formatarEndereco,
} from "@/utils/formatters"
import { salvarAgendamentoService } from "@/http/routes/appointments/create"
import { traduzirStatus } from "@/utils/statusTranslator"


export default function AppointmentPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [agendamentoAtual, setAgendamentoAtual] = useState<Agendamento | null>(null)
  const [dialogoAberto, setDialogoAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [loading, setLoading] = useState(true)

  // Verificar se o agendamento pode ser editado (apenas pendente ou confirmado)
  const podeEditarAgendamento = (status: string) => {
    return status === "pendente" || status === "confirmado"
  }

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      alert("Você precisa estar logado.")
      window.location.href = "/login"
      return
    }
    const tokenStr: string = token

    async function loadData() {
      try {
        const userData = await fetchCitizenMe(tokenStr)
        setUsuario(userData)

        const appointmentsData = await fetchCitizenAppointments(tokenStr)
        const ags = appointmentsData.map((ag: AppointmentAPIResponse) => ({
          id: ag.id,
          data: formatDate(ag.scheduled_at),
          tipoResiduo: ag.wasteItem?.type || "",
          status: traduzirStatus(ag.status),
        }))
        setAgendamentos(ags)
      } catch (error) {
        alert("Erro ao carregar dados do cidadão ou agendamentos.")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])


  const novoAgendamento = () => {
    setAgendamentoAtual({
      id: Date.now(),
      data: "",
      tipoResiduo: "",
      status: "pendente",
    })
    setModoEdicao(false)
    setDialogoAberto(true)
  }

  const editarAgendamento = (agendamento: Agendamento) => {
    // Verificar se o agendamento pode ser editado
    if (!podeEditarAgendamento(agendamento.status)) {
      alert("Este agendamento não pode ser editado pois já foi concluído ou cancelado.")
      return
    }

    setAgendamentoAtual({ ...agendamento })
    setModoEdicao(true)
    setDialogoAberto(true)
  }
  
  const excluirAgendamento = (id: number | string) => {
    const agendamento = agendamentos.find(a => a.id === id)

    // Verificar se o agendamento pode ser excluído
    if (agendamento && !podeEditarAgendamento(agendamento.status)) {
      alert("Este agendamento não pode ser excluído pois já foi concluído ou cancelado.")
      return
    }

    setAgendamentos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "CANCELED" } : a))
    )

  }

  const salvarAgendamento = async () => {
    if (!agendamentoAtual) return
  
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Token não encontrado")
      return
    }
  
    try {
      const agendamentoFormatado = await salvarAgendamentoService(
        agendamentoAtual,
        token,
        modoEdicao
      )
  
      setAgendamentos((prev) =>
        modoEdicao
          ? prev.map((ag) => (ag.id === agendamentoFormatado.id ? agendamentoFormatado : ag))
          : [...prev, agendamentoFormatado]
      )
  
      setDialogoAberto(false)
    } catch (error) {
      alert("Erro ao salvar agendamento.")
      console.error(error)
    }
  }
  

  const atualizarAgendamentoAtual = (campo: keyof Agendamento, valor: string) => {
    if (agendamentoAtual) {
      // Não permitir alteração do status
      if (campo === 'status') {
        return
      }

      setAgendamentoAtual({
        ...agendamentoAtual,
        [campo]: valor,
      })
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando informações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNovoAgendamento={novoAgendamento} />

      <div className="max-w-full px-8 py-6">

        {/* Card de Informações do Cidadão */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-9 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xl font-semibold text-gray-900 truncate">
                  {usuario?.name || "Usuário"}
                </h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${usuario?.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                  }`}>
                  {usuario?.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Contato</h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate">{usuario?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{formatarTelefone(usuario?.phone || "")}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 ml-10">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Endereço</h3>
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="leading-relaxed">
                        {formatarEndereco(usuario?.address)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        CEP: {usuario?.address?.zipCode || "Não informado"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Agendamentos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Meus Agendamentos</h2>
              <p className="text-sm text-gray-500 mt-1">Gerencie suas coletas de forma sustentável</p>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm text-gray-500">
                {agendamentos.length} {agendamentos.length === 1 ? 'agendamento' : 'agendamentos'}
              </span>
            </div>
          </div>

          <AppointmentList
            agendamentos={agendamentos}
            onEditar={editarAgendamento}
            onExcluir={excluirAgendamento}
            getStatusColor={getStatusColor}
            statusOptions={statusOptions}
            novoAgendamento={novoAgendamento}

          />
        </div>
      </div>

      {agendamentoAtual && (
        <AppointmentModal
          aberto={dialogoAberto}
          setAberto={setDialogoAberto}
          agendamento={agendamentoAtual}
          modoEdicao={modoEdicao}
          atualizarAgendamento={atualizarAgendamentoAtual}
          salvarAgendamento={salvarAgendamento}
          statusOptions={statusOptions}
          enderecoUsuario={formatarEndereco(usuario?.address)}

        />
      )}
    </div>
  )
}