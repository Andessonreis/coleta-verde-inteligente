"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Upload, X, AlertTriangle } from "lucide-react"
import type { ColetaRota } from "@/types/coleta"

type ProblemaDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  coleta: ColetaRota
  onSalvar: (observacao: string, fotoUrl: string) => void
}

export function ProblemaDialog({ open, onOpenChange, coleta, onSalvar }: ProblemaDialogProps) {
  const [observacao, setObservacao] = useState("")
  const [foto, setFoto] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      setObservacao(coleta.observacoes || "")
      setFoto(null)
      setFotoPreview(null)
      setError("")
    } else {
      // Limpar estados ao fechar
      setObservacao("")
      setFoto(null)
      setFotoPreview(null)
      setError("")
    }
  }, [open, coleta.observacoes])

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione apenas arquivos de imagem.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 5MB.")
      return
    }

    setError("")
    setFoto(file)

    const reader = new FileReader()
    reader.onload = (e) => {
      setFotoPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoverFoto = () => {
    setFoto(null)
    setFotoPreview(null)
    setError("")
  }

  const uploadFoto = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", "problema_coleta")
    formData.append("coletaId", coleta.id)

    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Usuário não autenticado.")
    }

    const response = await fetch("http://localhost:8080/api/upload", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erro ao fazer upload da imagem: ${errorText}`)
    }

    const data = await response.json()
    return data.url
  }

  const handleSalvar = async () => {
    if (!observacao.trim()) {
      setError("A observação é obrigatória.")
      return
    }

    if (!foto) {
      setError("A foto é obrigatória para reportar problemas.")
      return
    }

    setUploading(true)
    setError("")

    try {
      const fotoUrl = await uploadFoto(foto)
      onSalvar(observacao.trim(), fotoUrl)
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "Erro ao processar o problema. Tente novamente.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Reportar Problema
          </DialogTitle>
          <DialogDescription>
            Descreva o problema encontrado e anexe uma foto como evidência.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Coleta:</p>
            <p className="text-sm text-gray-600">{coleta.cidadao.nome}</p>
            <p className="text-sm text-gray-600">{coleta.endereco}</p>
            <p className="text-sm text-gray-600">Tipo: {coleta.tipoResiduo}</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="observacao">
              Observações <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="observacao"
              placeholder="Descreva detalhadamente o problema encontrado (ex: resíduo diferente do programado, itens não autorizados, etc.)"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="foto">
              Foto da Evidência <span className="text-red-500">*</span>
            </Label>

            {!fotoPreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Clique para selecionar uma foto</p>
                <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
                <Input
                  id="foto"
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={fotoPreview || "/placeholder.svg"}
                  alt="Preview da foto"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemoverFoto}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Atenção:</strong> Problemas reportados podem resultar em penalidades para o cidadão, incluindo
              bloqueio temporário do serviço. Certifique-se de que as informações estão corretas.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSalvar}
            className="bg-red-600 hover:bg-red-700"
            disabled={!observacao.trim() || !foto || uploading}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Reportar Problema
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
