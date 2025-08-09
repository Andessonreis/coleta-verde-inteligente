"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Plus } from "lucide-react";

export function NewScheduleModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    date: "",
    time: "",
    estimatedWeight: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validação básica de data/hora
    if (!formData.date || !formData.time) {
      setError("Data e horário devem ser preenchidos.");
      setLoading(false);
      return;
    }

    // Combina em ISO 8601 (ex: 2024-01-15T14:00:00Z)
    const scheduledAt = new Date(`${formData.date}T${formData.time}`).toISOString();

    // Mapeia tipo para enum WasteType em maiúsculas conforme backend
    const wasteTypeMap: Record<string, string> = {
      reciclavel: "RECYCLABLE",
      organico: "ORGANIC",
      eletronico: "ELECTRONIC",
      perigoso: "HAZARDOUS",
    };
    const wasteType = wasteTypeMap[formData.type.toLowerCase()];
    if (!wasteType) {
      setError("Tipo de resíduo inválido.");
      setLoading(false);
      return;
    }

    // Payload conforme AppointmentPostRequestDTO
    const payload = {
      scheduled_at: scheduledAt,
      optional_photo_url: null, // pode adaptar para fotos no futuro
      waste: {
        type: wasteType,
        description:
          formData.type === "reciclavel"
            ? "Resíduos Recicláveis"
            : formData.type === "organico"
            ? "Resíduos Orgânicos"
            : formData.type === "eletronico"
            ? "Resíduos Eletrônicos"
            : "Resíduos Perigosos",
      },
      status: "SCHEDULED",
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:8080/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || "Erro ao criar agendamento.");
        setLoading(false);
        return;
      }

      setOpen(false);
      setFormData({
        type: "",
        date: "",
        time: "",
        estimatedWeight: "",
        notes: "",
      });
    } catch (err: any) {
      setError(err.message || "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-green-600 hover:bg-green-700" disabled={loading}>
          <Plus className="h-4 w-4" />
          Nova Solicitação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nova Solicitação de Coleta</DialogTitle>
            <DialogDescription>Agende uma nova coleta de resíduos para sua empresa.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipo de Resíduo
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
                required
              >
                <SelectTrigger className="col-span-3" id="type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reciclavel">Resíduos Recicláveis</SelectItem>
                  <SelectItem value="organico">Resíduos Orgânicos</SelectItem>
                  <SelectItem value="eletronico">Resíduos Eletrônicos</SelectItem>
                  <SelectItem value="perigoso">Resíduos Perigosos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Data
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Horário
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                required
                className="col-span-3"
              />
            </div>

            {/* Campos estimados (peso, notas) podem ficar no formulário mas não serão enviados por enquanto */}

            {/* Mensagem de erro */}
            {error && <p className="col-span-4 text-red-600 text-center">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" className="gap-2 bg-green-600 hover:bg-green-700" disabled={loading}>
              <Calendar className="h-4 w-4" />
              {loading ? "Salvando..." : "Agendar Coleta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
