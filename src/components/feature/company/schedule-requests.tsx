import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Recycle, XCircle } from "lucide-react";
import { format } from "date-fns";

interface Address {
  publicPlace: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  uf: string;
  zipCode: string;
}

interface Agendamento {
  id: string;
  data: string; // dd/MM/yyyy
  time: string; // HH:mm
  status: string;
  address: string;
  type: string;
}


export function ScheduleRequests() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingCancelId, setLoadingCancelId] = useState<string | null>(null);
  const [companyAddress, setCompanyAddress] = useState<Address | null>(null);

  useEffect(() => {
    async function fetchCompanyAddress() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:8080/api/companies/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar dados da empresa");

        const data = await res.json();
        setCompanyAddress(data.address || null);
      } catch (e) {
        console.error("Erro ao carregar endereço da empresa:", e);
      }
    }
    fetchCompanyAddress();
  }, []); // roda uma vez só

  useEffect(() => {
    if (!companyAddress) return;

    async function fetchAgendamentos() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:8080/api/appointments/company", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar agendamentos");

        const data = await res.json();

        const mapped = data.map((appointment: any) => {
          const scheduledDate = new Date(appointment.scheduled_at);
          const requesterAddress = appointment.requester?.address;

          const formatAddress = (addr: Address | null) => {
            if (!addr) return "Endereço não informado";
            const streetOrPublicPlace = addr.street || addr.publicPlace || "";
            if (streetOrPublicPlace && addr.number) {
              return `${streetOrPublicPlace} ${addr.number}`;
            }
            return "Endereço não informado";
          };

          return {
            id: appointment.id,
            dateObj: scheduledDate,
            data: format(scheduledDate, "dd/MM/yyyy"),
            time: format(scheduledDate, "HH:mm"),
            status: appointment.status ?? "PENDING",
            address: requesterAddress
              ? formatAddress(requesterAddress)
              : formatAddress(companyAddress),
            type: appointment.wasteItem?.type ?? "Não informado",
          };
        });

        mapped.sort((a: { dateObj: { getTime: () => number; }; }, b: { dateObj: { getTime: () => number; }; }) => b.dateObj.getTime() - a.dateObj.getTime());

        setAgendamentos(mapped);
      } catch (error) {
        console.error(error);
      }
    }

    fetchAgendamentos();
  }, [companyAddress]); // roda toda vez que companyAddress mudar e não for null


  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "CONFIRMED":
        return "bg-green-500";
      case "CANCELED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
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
    <div className="grid gap-4">
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}

      {agendamentos.map((agendamento) => (
        <Card key={agendamento.id} className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">
              {agendamento.data} - {agendamento.time}
            </CardTitle>
            <Badge className={getStatusColor(agendamento.status)}>
              {agendamento.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{agendamento.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Recycle className="h-4 w-4 text-gray-500" />
              <span>{agendamento.type}</span>
            </div>
            <div className="flex gap-2">
              {agendamento.status !== "CANCELED" && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCancel(agendamento.id)}
                  disabled={loadingCancelId === agendamento.id}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  {loadingCancelId === agendamento.id ? "Cancelando..." : "Cancelar"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
