"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, Trash2, Camera, AlertCircle, Loader2 } from "lucide-react"

// Tipos assumidos baseados no código original
type WasteType = "ORGANIC" | "RECYCLABLE" | "ELECTRONIC" | "HAZARDOUS"

interface Empresa {
  id: string
  name: string
}

interface CreateAppointmentFormProps {
  company: Empresa
  onClose: () => void
}

export function CreateAppointmentForm({ company, onClose }: CreateAppointmentFormProps) {
  const [scheduledAt, setScheduledAt] = useState("")
  const [wasteType, setWasteType] = useState<WasteType>("ORGANIC")
  const [wasteDescription, setWasteDescription] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const wasteTypeOptions = [
    { value: "ORGANIC", label: "Orgânico", icon: "🌱" },
    { value: "RECYCLABLE", label: "Reciclável", icon: "♻️" },
    { value: "ELECTRONIC", label: "Eletrônico", icon: "📱" },
    { value: "HAZARDOUS", label: "Perigoso", icon: "⚠️" },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!scheduledAt) {
      setError("Por favor, informe a data e hora do agendamento")
      return
    }

    if (!wasteDescription) {
      setError("Por favor, descreva o resíduo")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Usuário não autenticado.")
        setLoading(false)
        return
      }

      const body = {
        scheduled_at: new Date(scheduledAt).toISOString(),
        optional_photo_url: photoUrl || null,
        waste: {
          type: wasteType,
          description: wasteDescription,
        },
        status: "PENDING",
      }

      const res = await fetch("http://localhost:8080/api/appointments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        setError(errData?.message || "Erro ao criar agendamento.")
        setLoading(false)
        return
      }

      onClose()
    } catch (e: any) {
      setError(e.message || "Erro ao conectar com o servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5 text-green-600" />
            Novo Agendamento
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Empresa: <span className="font-medium">{company.name}</span>
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="scheduledAt" className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4" />
                Data e Hora do Agendamento
              </Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
                className="w-full"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wasteType" className="flex items-center gap-2 text-sm font-medium">
                <Trash2 className="h-4 w-4" />
                Tipo de Resíduo
              </Label>
              <Select value={wasteType} onValueChange={(value) => setWasteType(value as WasteType)} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {wasteTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wasteDescription" className="text-sm font-medium">
                Descrição do Resíduo
              </Label>
              <Textarea
                id="wasteDescription"
                value={wasteDescription}
                onChange={(e) => setWasteDescription(e.target.value)}
                required
                maxLength={100}
                rows={3}
                placeholder="Descreva o tipo e quantidade do resíduo..."
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">{wasteDescription.length}/100 caracteres</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoUrl" className="flex items-center gap-2 text-sm font-medium">
                <Camera className="h-4 w-4" />
                URL da Foto (opcional)
              </Label>
              <Input
                id="photoUrl"
                type="url"
                placeholder="https://exemplo.com/foto.jpg"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                maxLength={255}
              />
              <p className="text-xs text-muted-foreground">
                Adicione uma foto do resíduo para facilitar a identificação
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Agendamento"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
