"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Settings, Save } from "lucide-react"

export function FrequencySettings() {
  const [settings, setSettings] = useState({
    defaultFrequency: "weekly",
    preferredTime: "14:00",
    autoSchedule: true,
  })

  const [companyId, setCompanyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Busca o ID da empresa e frequência atual para preencher o select ao carregar a página
  useEffect(() => {
    async function fetchCompany() {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const res = await fetch("http://localhost:8080/api/companies/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Erro ao buscar dados da empresa")

        const data = await res.json()
        setCompanyId(data.id)
        if (data.frequency) {
          setSettings(prev => ({ ...prev, defaultFrequency: data.frequency }))
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchCompany()
  }, [])

  const handleSave = async () => {
    setError(null)
    setSuccessMessage(null)
    if (!companyId) {
      setError("ID da empresa não encontrado.")
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

      const res = await fetch(`http://localhost:8080/api/companies/${companyId}/frequency`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          frequency: settings.defaultFrequency,
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        setError(errData?.message || "Erro ao salvar a frequência.")
      } else {
        setSuccessMessage("Frequência atualizada com sucesso!")
      }
    } catch (e: any) {
      setError(e.message || "Erro ao conectar com o servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center">
          <Settings className="mr-2 h-5 w-5 text-gray-600" />
          Configurações de Frequência
        </CardTitle>
        <CardDescription>Configure suas preferências de coleta</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="text-red-600">{error}</div>}
        {successMessage && <div className="text-green-600">{successMessage}</div>}

        <div className="space-y-2">
          <Label htmlFor="frequency">Frequência Padrão</Label>
          <Select
            value={settings.defaultFrequency}
            onValueChange={(value) => setSettings({ ...settings, defaultFrequency: value })}
          >
            <SelectTrigger id="frequency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diária</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Horário Preferido</Label>
          <Select
            value={settings.preferredTime}
            onValueChange={(value) => setSettings({ ...settings, preferredTime: value })}
          >
            <SelectTrigger id="time">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="08:00">08:00</SelectItem>
              <SelectItem value="10:00">10:00</SelectItem>
              <SelectItem value="14:00">14:00</SelectItem>
              <SelectItem value="16:00">16:00</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSave}
          className="w-full gap-2 bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          <Save className="h-4 w-4" />
          {loading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </CardContent>
    </Card>
  )
}
