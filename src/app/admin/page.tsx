"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf } from "lucide-react"

import { useAppointments } from '@/hooks/useAppointments'
import { useFilters } from '@/hooks/useFilters'
import { AppointmentFilter } from '@/utils/appointmentFilter'
import { StatsCalculator } from '@/utils/StatsCalculator'

import { StatsCards } from '@/components/feature/appointment/admin/StatsCards'
import { FilterControls } from '@/components/feature/appointment/admin/FilterControls'
import { AppointmentTable } from '@/components/feature/appointment/admin/AppointmentTable'
import { AssignmentDialog } from '@/components/feature/appointment/admin/AssignmentDialog'
import { Appointment } from '@/types/index'

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Truck } from "lucide-react"

export default function AdminPage() {
  const TOKEN = localStorage.getItem("token") 

  // Hooks customizados
  const { appointments, employees, loading, error, assignAppointment } = useAppointments()
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    wasteTypeFilter,
    setWasteTypeFilter,
    filterCriteria
  } = useFilters()

  // Estado para o diálogo de atribuição
  const [assignDialog, setAssignDialog] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState("")

  // Dados processados
  const filteredAppointments = AppointmentFilter.filter(appointments, filterCriteria)
  const stats = StatsCalculator.calculate(appointments, employees)

  // Handlers
  const handleAssignClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setAssignDialog(true)
  }

  const handleAssignConfirm = async () => {
    if (!selectedAppointment || !selectedEmployee) return

    const success = await assignAppointment(selectedAppointment.id, selectedEmployee)

    if (success) {
      setAssignDialog(false)
      setSelectedAppointment(null)
      setSelectedEmployee("")
    }
  }

  const handleDialogClose = (open: boolean) => {
    setAssignDialog(open)
    if (!open) {
      setSelectedAppointment(null)
      setSelectedEmployee("")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Erro: {error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Leaf className="h-8 w-8 text-green-600" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-green-800">Coleta Verde</h1>
              <span className="text-lg text-gray-600">- Administrador</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Gerencie agendamentos, funcionários 
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Main Content */}
        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
            <TabsTrigger value="employees">Funcionários</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <FilterControls
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  wasteTypeFilter={wasteTypeFilter}
                  onWasteTypeFilterChange={setWasteTypeFilter}
                />
                <AppointmentTable
                  appointments={filteredAppointments}
                  onAssignClick={handleAssignClick}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Funcionários</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Coletas Atribuídas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => {
                      const assignedCount = appointments.filter((a) => a.employee?.id === employee.id).length

                      return (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">{employee.name}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.registration}</TableCell>
                          <TableCell>{employee.jobTitle}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                employee.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }
                            >
                              {employee.status === "ACTIVE" ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Truck className="h-4 w-4 text-gray-500" />
                              <span>{assignedCount}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Assignment Dialog */}
        <AssignmentDialog
          open={assignDialog}
          onOpenChange={handleDialogClose}
          appointment={selectedAppointment}
          employees={employees}
          selectedEmployee={selectedEmployee}
          onEmployeeChange={setSelectedEmployee}
          onConfirm={handleAssignConfirm}
        />
      </div>
    </div>
  )
}