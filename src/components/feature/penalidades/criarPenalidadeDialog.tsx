"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, AlertTriangle } from "lucide-react"
import type { NovaPenalidade, Penalidade } from "@/types/penalidade"

interface CriarPenalidadeDialogProps {
  open: boolean
  onClose: () => void
  onCriar: (penalidade: NovaPenalidade) => Promise<void>
}

export function CriarPenalidadeDialog({ open, onClose, onCriar }: CriarPenalidadeDialogProps) {
  const [formData, setFormData] = useState<NovaPenalidade>({
    coletaId: "",
    cidadaoId: "",
    funcionarioId: "",
    tipo: "RESIDUE_MISMATCH",
    descricao: "",
    fotoEvidencia: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const tiposOptions: { value: Penalidade["tipo"]; label: string }[] = [
    { value: "RESIDUE_MISMATCH", label: "Resíduo Incorreto" },
    { value: "UNAUTHORIZED_ITEM", label: "Item Não Autorizado" },
    { value: "DANGEROUS_MATERIAL", label: "Material Perigoso" },
    { value: "VOLUME_EXCEEDED", label: "Volume Excedido" },
    { value: "OTHER", label: "Outros" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validações
    if (!formData.coletaId.trim()) {
      setError("ID da coleta é obrigatório")
      return
    }
    if (!formData.cidadaoId.trim()) {
      setError("ID do cidadão é obrigatório")
      return
    }
    if (!formData.funcionarioId.trim()) {
      setError("ID do funcionário é obrigatório")
      return
    }
    if (!formData.descricao.trim()) {
      setError("Descrição é obrigatória")
      return
    }
    if (!formData.fotoEvidencia.trim()) {
      setError("URL da foto de evidência é obrigatória")
      return
    }

    setLoading(true)
    try {
      await onCriar(formData)
      handleClose()
      alert("Penalidade criada com sucesso!")
    } catch (error) {
      setError("Erro ao criar penalidade. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      coletaId: "",
      cidadaoId: "",
      funcionarioId: "",
      tipo: "RESIDUE_MISMATCH",
      descricao: "",
      fotoEvidencia: "",
    })
    setError("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            Nova Penalidade
          </DialogTitle>
          <DialogDescription>
            Preencha os dados para criar uma nova penalidade que será enviada para análise.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coletaId">
                ID da Coleta <span className="text-red-500">*</span>
              </Label>
              <Input
                id="coletaId"
                value={formData.coletaId}
                onChange={(e) => setFormData({ ...formData, coletaId: e.target.value })}
                placeholder="Ex: 610412be-06d2-4011-8498-630760f7d65f"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidadaoId">
                ID do Cidadão <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cidadaoId"
                value={formData.cidadaoId}
                onChange={(e) => setFormData({ ...formData, cidadaoId: e.target.value })}
                placeholder="Ex: 5b83af02-dd9b-4a5b-9480-afccd161bf1c"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="funcionarioId">
                ID do Funcionário <span className="text-red-500">*</span>
              </Label>
              <Input
                id="funcionarioId"
                value={formData.funcionarioId}
                onChange={(e) => setFormData({ ...formData, funcionarioId: e.target.value })}
                placeholder="Ex: bb0f4aac-28d8-46c4-b7f8-7fc478a8689e"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">
                Tipo de Problema <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: Penalidade["tipo"]) => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tiposOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">
              Descrição do Problema <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva detalhadamente o problema encontrado..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fotoEvidencia">
              URL da Foto de Evidência <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fotoEvidencia"
              value={formData.fotoEvidencia}
              onChange={(e) => setFormData({ ...formData, fotoEvidencia: e.target.value })}
              placeholder="Ex: https://exemplo.com/foto-evidencia.jpg"
            />
          </div>

          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Atenção:</strong> Esta penalidade será criada com status "PENDING_ANALYSIS" e precisará ser
              analisada antes de ser aplicada. Certifique-se de que todas as informações estão corretas.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Penalidade
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
