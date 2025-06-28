"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, Calendar, Filter, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

import { useAppointments } from "@/hooks/useAppointments"
import { useFilters } from "@/hooks/useFilters"
import { AppointmentFilter } from "@/utils/appointmentFilter"
import { StatsCalculator } from "@/utils/StatsCalculator"

import { StatsCards } from "@/components/feature/appointment/admin/StatsCards"
import { FilterControls } from "@/components/feature/appointment/admin/FilterControls"
import { AppointmentTable } from "@/components/feature/appointment/admin/AppointmentTable"
import { AssignmentDialog } from "@/components/feature/appointment/admin/AssignmentDialog"
import type { Appointment } from "@/types/index"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Truck } from "lucide-react"
import ComponentCalendar from "@/components/calendar"

// Importação para cadastrar funcionário
import CadastrarFuncionarioModal from "@/components/feature/employee/cadastrarFuncionarioModal"
import { UserPlus } from "lucide-react"

//Importação para tabela de cidadãos
import CitizenTable from "@/components/feature/citizen/CitizenTable"


export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null)
  // Importação para cadastrar funcionário
  const [openRegisterModal, setOpenRegisterModal] = useState(false)

  const router = useRouter()

  // Hooks customizados
  const { appointments, employees, loading, error, assignAppointment } = useAppointments()
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    wasteTypeFilter,
    setWasteTypeFilter,
    filterCriteria,
  } = useFilters()

  // Estado para o diálogo de atribuição
  const [assignDialog, setAssignDialog] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState("")

  // Dados processados
  const filteredAppointments = AppointmentFilter.filter(appointments, filterCriteria)
  const stats = StatsCalculator.calculate(appointments, employees)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken) {
      alert("Você precisa estar logado.")
      router.push("/signin")
    } else {
      setToken(storedToken)
    }
  }, [router])

  if (!token) return null
  

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

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/signin")
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
    <div className="min-h-screen bg-gray-50">
      {/* Header compacto */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Leaf className="h-7 w-7 text-green-600" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-green-800">Coleta Verde</h1>
                <span className="text-gray-600">- Administrador</span>
              </div>
              <p className="text-xs text-gray-500">Gerencie agendamentos, funcionários</p>
            </div>
          </div>
           
          <div className="flex gap-2">
            <Button
              onClick={() => setOpenRegisterModal(true)}
              size="sm"
              className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
            >
              <UserPlus className="h-4 w-4" />
              Cadastrar Funcionário
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 hover:border-red-300"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards no topo */}
      <div className="px-6 py-4">
        <StatsCards stats={stats} />
      </div>

      <div className="flex">
        {/* Sidebar apenas com calendário */}
        <div className="w-80 bg-white border-r border-gray-200 p-4">
          <ComponentCalendar />
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 p-6">
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
              <TabsTrigger value="employees">Funcionários</TabsTrigger>
              <TabsTrigger value="citizens">Cidadãos</TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="space-y-4">
              {/* Filtros compactos */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="h-4 w-4 text-gray-600" />
                    <h3 className="text-sm font-semibold text-gray-800">Filtros</h3>
                  </div>
                  <FilterControls
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    wasteTypeFilter={wasteTypeFilter}
                    onWasteTypeFilterChange={setWasteTypeFilter}
                  />
                </CardContent>
              </Card>

              {/* Tabela principal */}
              <Card>
                <CardContent className="p-0">
                  <AppointmentTable appointments={filteredAppointments} onAssignClick={handleAssignClick} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employees" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Funcionários</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Matrícula</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Coletas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => {
                        const assignedCount = appointments.filter((a) => a.employee?.id === employee.id).length

                        return (
                          <TableRow key={employee.id}>
                            <TableCell className="font-medium">{employee.name}</TableCell>
                            <TableCell className="text-sm text-gray-600">{employee.email}</TableCell>
                            <TableCell className="text-sm">{employee.registration}</TableCell>
                            <TableCell className="text-sm">{employee.jobTitle}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  employee.status === "ACTIVE"
                                    ? "bg-green-100 text-green-800 text-xs"
                                    : "bg-red-100 text-red-800 text-xs"
                                }
                              >
                                {employee.status === "ACTIVE" ? "Ativo" : "Inativo"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Truck className="h-3 w-3 text-gray-500" />
                                <span className="text-sm">{assignedCount}</span>
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

            <TabsContent value="citizens" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Cidadãos</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CitizenTable />
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>

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

      return (
        <CadastrarFuncionarioModal
          open={openRegisterModal}
          onOpenChange={setOpenRegisterModal}
        />
      )
    </div>
  )
  
}
