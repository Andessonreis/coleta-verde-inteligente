"use client"

import { useState } from "react"
import { CheckCircle, Mail, AlertCircle, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { EmailResponse } from "@/services/emailService"

interface EmailConfirmationStatusProps {
  emailStatus: EmailResponse | null
  isLoading: boolean
  onResendEmail?: () => void
}

export function EmailConfirmationStatus({ emailStatus, isLoading, onResendEmail }: EmailConfirmationStatusProps) {
  const [isResending, setIsResending] = useState(false)

  const handleResend = async () => {
    if (!onResendEmail) return

    setIsResending(true)
    try {
      await onResendEmail()
    } finally {
      setIsResending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
          <div>
            <h4 className="font-medium text-blue-800">Enviando confirmação por e-mail...</h4>
            <p className="text-sm text-blue-700 mt-1">Aguarde enquanto processamos seu agendamento.</p>
          </div>
        </div>
      </div>
    )
  }

  if (!emailStatus) return null

  if (emailStatus.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-green-800">E-mail de confirmação enviado!</h4>
            <p className="text-sm text-green-700 mt-1">{emailStatus.message}</p>

            <div className="mt-3 p-3 bg-green-100 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-green-800">
                <Mail className="h-4 w-4" />
                <span>Verifique sua caixa de entrada e spam</span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                O e-mail contém todos os detalhes do seu agendamento e instruções importantes.
              </p>
            </div>

            {onResendEmail && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-green-700 border-green-300 hover:bg-green-100"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Reenviando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reenviar e-mail
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-red-800">Erro ao enviar e-mail</h4>
          <p className="text-sm text-red-700 mt-1">
            Seu agendamento foi criado com sucesso, mas houve um problema ao enviar o e-mail de confirmação.
          </p>

          {onResendEmail && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResend}
                disabled={isResending}
                className="text-red-700 border-red-300 hover:bg-red-100"
              >
                {isResending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Tentando novamente...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tentar enviar novamente
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
