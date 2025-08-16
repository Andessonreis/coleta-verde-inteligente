"use client"

import type React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { tiposResiduoOptions, type TipoResiduoValue } from "@/types/tiposResiduoOptions"
import { X, Calendar, Package, MapPin } from "lucide-react"
import { DatePickerCalendar } from "@/components/date-picker-calendar"
import { useAppointmentRestrictions } from "@/hooks/useAppointmentRestrictions"
import { AppointmentRestrictionInfo } from "@/components/appointment-restriction-info"
import { EmailConfirmationStatus } from "@/components/email-confirmation-status"
/* import { EmailService, type EmailResponse } from "@/services/emailService" */
import type { Agendamento } from "@/types/appointment"
import type { Usuario } from "@/types/citizen"

interface AppointmentModalProps {
  aberto: boolean
  setAberto: React.Dispatch<React.SetStateAction<boolean>>
  agendamento: Agendamento | null
  modoEdicao: boolean
  atualizarAgendamento: (campo: keyof Agendamento, valor: string) => void
  salvarAgendamento: () => void
  statusOptions: { value: string; label: string; color: string }[]
  enderecoUsuario: string
  agendamentos: Agendamento[] // Adicionar esta linha
  usuario: Usuario | null // Adicionar esta linha
}

export default function AppointmentModal({
  aberto,
  setAberto,
  agendamento,
  modoEdicao,
  atualizarAgendamento,
  salvarAgendamento,
  enderecoUsuario,
  agendamentos,
  usuario,
}: AppointmentModalProps) {
/*   const [emailStatus, setEmailStatus] = useState<EmailResponse | null>(null) */
  const [isLoadingEmail, setIsLoadingEmail] = useState(false)

  // Hook sempre chamado, independente do estado do modal
  const restriction = useAppointmentRestrictions(agendamentos)

  // AGORA SIM podemos fazer o retorno condicional
  if (!aberto || !agendamento) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar restrição de 30 dias (apenas para novos agendamentos)
    if (!modoEdicao && !restriction.canSchedule) {
      alert(`Você não pode agendar uma nova coleta. ${restriction.reason}`)
      return
    }

    // Validar se uma data foi selecionada
    if (!agendamento.data) {
      alert("Por favor, selecione uma data para o agendamento.")
      return
    }

    // Validar se um tipo de resíduo foi selecionado
    if (!agendamento.tipoResiduo) {
      alert("Por favor, selecione o tipo de resíduo.")
      return
    }

    // Salvar agendamento e enviar e-mail
    try {
      setIsLoadingEmail(true)
      await salvarAgendamento()

      // Enviar e-mail de confirmação apenas para novos agendamentos
/*       if (!modoEdicao && usuario) {
        await sendConfirmationEmail()
      } */
    } catch (error) {
      console.error("Erro ao processar agendamento:", error)
    } finally {
      setIsLoadingEmail(false)
    }
  }
/*
  const sendConfirmationEmail = async () => {
    if (!usuario || !agendamento) return

    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const emailData = {
        appointmentId: agendamento.id.toString(),
        citizenName: usuario.name,
        citizenEmail: usuario.email,
        appointmentDate: agendamento.data,
        wasteType: EmailService.formatWasteTypeForEmail(agendamento.tipoResiduo),
        address: enderecoUsuario,
      }

      const result = await EmailService.sendAppointmentConfirmation(emailData, token)
      setEmailStatus(result)
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error)
      setEmailStatus({
        success: false,
        message: "Erro ao enviar e-mail de confirmação",
      })
    }
  } */

  const handleClose = () => {
    setAberto(false)
    // Limpar estados quando fechar
/*     setEmailStatus(null) */
    setIsLoadingEmail(false)
  }

  const handleDateSelect = (date: string) => {
    atualizarAgendamento("data", date)
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {modoEdicao ? "Editar Agendamento" : "Novo Agendamento"}
          </h2>
          <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Verificação de Restrição de 30 dias */}
          {!modoEdicao && <AppointmentRestrictionInfo restriction={restriction} />}

          {/* Seleção de Data com Calendário */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Data da Coleta
            </label>

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <DatePickerCalendar selectedDate={agendamento.data} onDateSelect={handleDateSelect} />
            </div>

            {!agendamento.data && (
              <p className="text-sm text-red-600">Selecione uma data disponível no calendário acima.</p>
            )}
          </div>

          {/* Tipo de Resíduo */}
          <div className="space-y-2">
            <label htmlFor="tipoResiduo" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Package className="w-4 h-4 text-emerald-600" />
              Tipo de Resíduo
            </label>
            <select
              id="tipoResiduo"
              value={agendamento.tipoResiduo}
              onChange={(e) => atualizarAgendamento("tipoResiduo", e.target.value as TipoResiduoValue)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              required
            >
              <option value="">Selecione o tipo de resíduo</option>
              {tiposResiduoOptions.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Endereço (apenas exibição) */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Endereço de Coleta
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700">
              {enderecoUsuario || "Endereço não cadastrado"}
            </div>
            <p className="text-xs text-gray-500">O endereço é vinculado ao seu perfil de usuário.</p>
          </div>

          {/* Informações importantes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Informações Importantes:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• As coletas são realizadas apenas em dias úteis</li>
              <li>• Horário de coleta: 8h às 17h</li>
              <li>• Limite de agendamentos por dia para garantir qualidade do serviço</li>
              <li>• Você receberá uma confirmação por email</li>
              <li>• Máximo de 1 agendamento por residência a cada 30 dias</li>
            </ul>
          </div>

          {/* Status do E-mail */}
          {/* <EmailConfirmationStatus
            emailStatus={emailStatus}
            isLoading={isLoadingEmail}
            onResendEmail={sendConfirmationEmail}
          />
 */}
          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={
                !agendamento.data ||
                !agendamento.tipoResiduo ||
                (!modoEdicao && !restriction.canSchedule) ||
                isLoadingEmail
              }
            >
              {isLoadingEmail ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processando...
                </>
              ) : (
                <>{modoEdicao ? "Atualizar" : "Criar"} Agendamento</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
