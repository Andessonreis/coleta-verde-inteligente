/* "use client"

export interface EmailConfirmationData {
  appointmentId: string
  citizenName: string
  citizenEmail: string
  appointmentDate: string
  wasteType: string
  address: string
}

export interface EmailResponse {
  success: boolean
  message: string
  emailId?: string
}

export class EmailService {
  private static readonly API_BASE_URL = "http://localhost:8080/api"

  static async sendAppointmentConfirmation(data: EmailConfirmationData, token: string): Promise<EmailResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/emails/appointment-confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointmentId: data.appointmentId,
          recipientEmail: data.citizenEmail,
          recipientName: data.citizenName,
          appointmentDate: data.appointmentDate,
          wasteType: data.wasteType,
          address: data.address,
          templateType: "APPOINTMENT_CONFIRMATION",
        }),
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const result = await response.json()
      return {
        success: true,
        message: "E-mail de confirmação enviado com sucesso!",
        emailId: result.emailId,
      }
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error)

      // Fallback: simular envio de e-mail
      return this.simulateEmailSending(data)
    }
  }

  static async sendAppointmentCancellation(data: EmailConfirmationData, token: string): Promise<EmailResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/emails/appointment-cancellation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointmentId: data.appointmentId,
          recipientEmail: data.citizenEmail,
          recipientName: data.citizenName,
          appointmentDate: data.appointmentDate,
          wasteType: data.wasteType,
          templateType: "APPOINTMENT_CANCELLATION",
        }),
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const result = await response.json()
      return {
        success: true,
        message: "E-mail de cancelamento enviado com sucesso!",
        emailId: result.emailId,
      }
    } catch (error) {
      console.error("Erro ao enviar e-mail de cancelamento:", error)
      return this.simulateEmailSending(data, "cancellation")
    }
  }

  private static simulateEmailSending(
    data: EmailConfirmationData,
    type: "confirmation" | "cancellation" = "confirmation",
  ): Promise<EmailResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`📧 E-mail simulado enviado para ${data.citizenEmail}:`)
        console.log(`Tipo: ${type === "confirmation" ? "Confirmação" : "Cancelamento"}`)
        console.log(`Agendamento: ${data.appointmentDate} - ${data.wasteType}`)
        console.log(`Endereço: ${data.address}`)

        resolve({
          success: true,
          message: `E-mail de ${type === "confirmation" ? "confirmação" : "cancelamento"} enviado com sucesso! (simulado)`,
          emailId: `sim_${Date.now()}`,
        })
      }, 1000)
    })
  }

  static formatWasteTypeForEmail(wasteType: string): string {
    const wasteTypeMap: Record<string, string> = {
      ORGANIC: "Resíduo Orgânico",
      RECYCLABLE: "Material Reciclável",
      ELECTRONIC: "Lixo Eletrônico",
      CONSTRUCTION: "Entulho de Construção",
      BULKY: "Resíduo Volumoso",
      organico: "Resíduo Orgânico",
      reciclavel: "Material Reciclável",
      eletronico: "Lixo Eletrônico",
      construcao: "Entulho de Construção",
      volumoso: "Resíduo Volumoso",
    }

    return wasteTypeMap[wasteType] || wasteType
  }
}
 */
