import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ColetaRota } from "@/types/coleta"

type ProblemaDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  coleta: ColetaRota
  onSalvar: (observacao: string) => void
}

export function ProblemaDialog({
  open,
  onOpenChange,
  coleta,
  onSalvar,
}: ProblemaDialogProps) {
  const [observacao, setObservacao] = useState("")

  useEffect(() => {
    if (open) {
      setObservacao(coleta.observacoes || "")
    } else {
      setObservacao("")
    }
  }, [open, coleta.observacoes])

  const handleSalvar = () => {
    if (!observacao.trim()) return
    onSalvar(observacao.trim())
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reportar Problema</DialogTitle>
          <DialogDescription>
            Descreva o problema encontrado durante a coleta.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="observacao">Observações</Label>
            <Textarea
              id="observacao"
              placeholder="Descreva o problema encontrado..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSalvar}
            className="bg-red-600 hover:bg-red-700"
            disabled={!observacao.trim()}
          >
            Reportar Problema
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
