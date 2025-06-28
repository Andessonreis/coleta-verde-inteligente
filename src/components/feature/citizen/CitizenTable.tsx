"use client"

import { useEffect, useState } from "react"
import { API_BASE_URL } from "@/http/config"
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type Citizen = {
  id: string
  name: string
  email: string
  status: string
}

export default function CitizenTable() {
  const [citizens, setCitizens] = useState<Citizen[]>([])

  const fetchCitizens = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/citizens/list`)
      const data = await response.json()
      setCitizens(data)
    } catch (err) {
      console.error("Erro ao buscar cidadãos:", err)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`${API_BASE_URL}/citizens/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      fetchCitizens()
    } catch (err) {
      console.error("Erro ao atualizar status:", err)
    }
  }

  useEffect(() => {
    fetchCitizens()
  }, [])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {citizens.map((citizen) => (
          <TableRow key={citizen.id}>
            <TableCell className="font-medium">{citizen.name}</TableCell>
            <TableCell className="text-sm text-gray-600">{citizen.email}</TableCell>
            <TableCell>
              <Badge
                className={
                  citizen.status === "ACTIVE"
                    ? "bg-green-100 text-green-800 text-xs"
                    : "bg-red-100 text-red-800 text-xs"
                }
              >
                {citizen.status === "ACTIVE" ? "Ativo" : "Suspenso"}
              </Badge>
            </TableCell>
            <TableCell className="space-x-2">
              <button
                onClick={() => updateStatus(citizen.id, "ACTIVE")}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                Ativar
              </button>
              <button
                onClick={() => updateStatus(citizen.id, "SUSPENDED")}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Suspender
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
