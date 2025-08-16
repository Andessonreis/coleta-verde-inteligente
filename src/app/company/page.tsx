"use client";

import { useEffect, useState } from "react";
import { fetchCompanyMe } from "@/http/routes/companies/me"; // novo fetch para empresa
import { fetchCompanyAppointments } from "@/http/routes/appointments/company"; // novo fetch para agendamentos da empresa
import { Empresa } from "@/types/company";
import { Agendamento } from "@/utils/appointmentUtils";
import { CompanyHeader } from "@/components/feature/company/company-header";
import { CompanyStats } from "@/components/feature/company/company-stats";
import { ScheduleRequests } from "@/components/feature/company/schedule-requests";
import { CollectionHistory } from "@/components/feature/company/collection-history";
import { FrequencySettings } from "@/components/feature/company/frequency-settings";
import { calculateStats } from "@/utils/appointmentUtils";
import { traduzirStatus } from "@/utils/statusTranslator";
import { formatDate } from "@/utils/formatters";

export default function CompanyDashboard() {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Usuário não autenticado");
      setLoading(false);
      return;
    }

    Promise.all([fetchCompanyMe(token), fetchCompanyAppointments(token)])
      .then(([empresaData, agendamentosData]) => {
        setEmpresa(empresaData);

        const mappedAgendamentos = agendamentosData.map((item: any) => ({
          id: item.id,
          data: formatDate(item.scheduled_at),
          status: traduzirStatus(item.status),
          // adicione outros campos que precisa mostrar
          requesterName: item.requester?.name ?? "N/A",
          description: item.wasteItem?.description ?? "N/A",
        }));

        setAgendamentos(mappedAgendamentos);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Erro ao carregar dados");
        setLoading(false);
      });
  }, [hasMounted]);

  if (!hasMounted) return null;
  if (loading) return <p>Carregando dados da empresa...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!empresa) return <p>Empresa não encontrada</p>;

  const stats = calculateStats(agendamentos);

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader company={empresa} />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800">Portal da Empresa</h1>
          <p className="text-gray-600 mt-2">
            Solicite e acompanhe suas coletas de resíduos corporativos
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <CompanyStats stats={stats} />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ScheduleRequests/>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <FrequencySettings />
          </div>
        </div>
      </main>
    </div>
  );
}
