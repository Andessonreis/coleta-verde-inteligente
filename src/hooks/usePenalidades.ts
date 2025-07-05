"use client";

import { useState, useEffect } from "react";
import type { Penalidade, BloqueioAtivo } from "@/types/penalidade";

export function usePenalidades() {
  const [penalidades, setPenalidades] = useState<Penalidade[]>([]);
  const [bloqueiosAtivos, setBloqueiosAtivos] = useState<BloqueioAtivo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPenalidades = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/penalidades", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
     
      setPenalidades(data);
    } catch (error) {
      console.error("Erro ao buscar penalidades:", error);
      setPenalidades([]); 
    } finally {
      setLoading(false);
    }
  };

  const criarPenalidade = async (
    appointmentId: string,
    citizenId: string,
    employeeId: string,
    type: Penalidade["tipo"],
    description: string,
    evidencePhotoUrl: string,
    blockDays: number = 60
  ): Promise<Penalidade | undefined> => {
    const payload = {
      appointmentId,
      citizenId,
      employeeId,
      type,
      description,
      evidencePhotoUrl,
      blockDays,
    };    

    try {
      const token = localStorage.getItem("token");
      console.log("Payload para criar penalidade:", payload);

      const response = await fetch("http://localhost:8080/api/penalidades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      console.log("Response: ", response)
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status} - ${errorText}`);
      }

      const novaPenalidade = await response.json();
      setPenalidades((prev) => [...prev, novaPenalidade]);
      return novaPenalidade;
    } catch (error) {
      console.error("Erro ao criar penalidade:", error);
      return undefined;
    }
  };
  const analisarPenalidade = async (
    penalidadeId: string,
    aprovada: boolean, 
    observacoes: string
  ): Promise<void> => {
    const payload = {
      approved: aprovada,    
      observations: observacoes,  
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/penalidades/${penalidadeId}/analisar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // Envie o payload corrigido
          body: JSON.stringify(payload),
        }
      );
        
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status} - ${errorText}`);
      }

      const penalidadeAtualizada = await response.json();

      setPenalidades((prev) =>
        prev.map((p) => (p.id === penalidadeId ? penalidadeAtualizada : p))
      );

      // Se aprovado, cria bloqueio ativo localmente
      if (
        aprovada &&
        penalidadeAtualizada.dataInicioBloqueio &&
        penalidadeAtualizada.dataFimBloqueio
      ) {
        const novoBloqueio: BloqueioAtivo = {
          cidadaoId: penalidadeAtualizada.citizenId,
          dataInicio: penalidadeAtualizada.dataInicioBloqueio,
          dataFim: penalidadeAtualizada.dataFimBloqueio,
          motivoPenalidade: penalidadeAtualizada.description,
          penalidadeId: penalidadeAtualizada.id,
        };
        setBloqueiosAtivos((prev) => [...prev, novoBloqueio]);
      }
    } catch (error) {
      console.error("Erro ao analisar penalidade:", error);
      throw error; 
    }
  };

  const verificarBloqueio = (cidadaoId: string): BloqueioAtivo | null => {
    const agora = new Date();
    return (
      bloqueiosAtivos.find(
        (bloqueio) =>
          bloqueio.cidadaoId === cidadaoId &&
          new Date(bloqueio.dataFim) > agora
      ) || null
    );
  };

  useEffect(() => {
    fetchPenalidades();
  }, []);

  return {
    penalidades,
    bloqueiosAtivos,
    loading,
    criarPenalidade,
    analisarPenalidade,
    verificarBloqueio,
    refetchPenalidades: fetchPenalidades,
  };
}
