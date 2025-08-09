"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MoreVertical, MapPin, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NewScheduleModal } from "./new-schedule-modal";

interface Agendamento {
  id: string;
  data: string;
  time?: string;
  status: string;
  frequency?: string;
  estimatedWeight?: string;
  address?: string;
  type?: string;
}

interface ScheduleRequestsProps {
  agendamentos: Agendamento[];
}

export function ScheduleRequests({ agendamentos: initialAgendamentos }: ScheduleRequestsProps) {
  const [agendamentos, setAgendamentos] = useState(initialAgendamentos);
  const [loadingCancelId, setLoadingCancelId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
      case "pendente":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Pendente
          </Badge>
        );
      case "scheduled":
      case "agendado":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Agendado
          </Badge>
        );
      case "completed":
      case "concluido":
      case "concluídas":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Concluído
          </Badge>
        );
      case "cancelled":
      case "cancelado":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelado
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFrequencyText = (frequency?: string) => {
    if (!frequency) return "-";
    switch (frequency.toLowerCase()) {
      case "daily":
      case "diária":
        return "Diária";
      case "weekly":
      case "semanal":
        return "Semanal";
      case "monthly":
      case "mensal":
        return "Mensal";
      default:
        return frequency;
    }
  };

  const extractTime = (datetime: string) => {
    try {
      const dateObj = new Date(datetime);
      return dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  async function handleCancel(id: string) {
    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return;

    setError(null);
    setLoadingCancelId(id);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado.");
        setLoadingCancelId(null);
        return;
      }

      const res = await fetch(`http://localhost:8080/api/appointments/${id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "CANCELED",
          observacoes: "Cancelado pelo usuário via frontend",
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        setError(errData?.message || "Erro ao cancelar agendamento.");
        setLoadingCancelId(null);
        return;
      }

      setAgendamentos((old) =>
        old.map((a) => (a.id === id ? { ...a, status: "CANCELED" } : a))
      );

    } catch (e: any) {
      setError(e.message || "Erro ao conectar com o servidor.");
    } finally {
      setLoadingCancelId(null);
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-blue-600" />
            Solicitações de Coleta
          </CardTitle>
          <CardDescription>Gerencie seus agendamentos de coleta</CardDescription>
        </div>
        <NewScheduleModal />
      </CardHeader>
      <CardContent>
        {error && <p className="mb-4 text-center text-red-600">{error}</p>}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de Resíduo</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Frequência</TableHead>
                <TableHead>Peso Est.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agendamentos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    Nenhum agendamento encontrado.
                  </TableCell>
                </TableRow>
              )}
              {agendamentos.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <div className="font-medium">{schedule.type ?? "N/A"}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {schedule.address ?? "Endereço não informado"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <div>
                        <div>{new Date(schedule.data).toLocaleDateString("pt-BR")}</div>
                        <div className="text-sm text-muted-foreground">
                          {schedule.time ?? extractTime(schedule.data)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getFrequencyText(schedule.frequency)}</TableCell>
                  <TableCell>{schedule.estimatedWeight ?? "-"}</TableCell>
                  <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={loadingCancelId === schedule.id}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                        {/* Removidos: editar e reagendar */}
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleCancel(schedule.id)}
                          disabled={loadingCancelId === schedule.id}
                        >
                          {loadingCancelId === schedule.id ? "Cancelando..." : "Cancelar"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
