"use client"

import { AlertCircle, Calendar, Clock, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { AppointmentRestriction } from "@/hooks/useAppointmentRestrictions"

interface AppointmentRestrictionInfoProps {
  restriction: AppointmentRestriction
}

export function AppointmentRestrictionInfo({ restriction }: AppointmentRestrictionInfoProps) {
  if (restriction.canSchedule) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-800">Você pode agendar uma nova coleta!</h4>
            <p className="text-sm text-green-700 mt-1">Não há restrições para criar um novo agendamento.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-amber-800">Limite de agendamento atingido</h4>
          <p className="text-sm text-amber-700 mt-1">{restriction.reason}</p>

          <div className="mt-3 space-y-2">
            {restriction.lastAppointmentDate && (
              <div className="flex items-center gap-2 text-sm text-amber-700">
                <Calendar className="h-4 w-4" />
                <span>Último agendamento: {new Date(restriction.lastAppointmentDate).toLocaleDateString("pt-BR")}</span>
              </div>
            )}

            {restriction.nextAvailableDate && (
              <div className="flex items-center gap-2 text-sm text-amber-700">
                <Clock className="h-4 w-4" />
                <span>
                  Próximo agendamento disponível: {new Date(restriction.nextAvailableDate).toLocaleDateString("pt-BR")}
                </span>
                <Badge variant="outline" className="text-xs">
                  {restriction.daysRemaining} {restriction.daysRemaining === 1 ? "dia" : "dias"}
                </Badge>
              </div>
            )}
          </div>

          <div className="mt-3 p-3 bg-amber-100 rounded-lg">
            <p className="text-xs text-amber-800">
              <strong>Por que existe esse limite?</strong> Para garantir um serviço de qualidade e permitir que todos os
              cidadãos tenham acesso à coleta, limitamos a um agendamento por residência a cada 30 dias.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
