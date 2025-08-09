"use client"

import { useState } from "react"
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

  const handleSave = () => {
    // Implementar lógica para salvar configurações
    console.log("Configurações salvas:", settings)
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

        <Button onClick={handleSave} className="w-full gap-2 bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4" />
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  )
}
