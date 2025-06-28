import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserPlus, Calendar, Truck } from "lucide-react"
import { Appointment } from '@/types/index'
import { StatusHelper } from '@/utils/StatusHelper'

interface AppointmentTableProps {
  appointments: Appointment[]
  onAssignClick: (appointment: Appointment) => void
}

export const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
  onAssignClick
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Solicitante</TableHead>
          <TableHead>Endereço</TableHead>
          <TableHead>Resíduo</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Funcionário</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment.id}>
            <TableCell>
              <div>
                <div className="font-medium">{appointment.requester.name}</div>
                <div className="text-sm text-gray-500">{appointment.requester.email}</div>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                <div>
                  {appointment.requester.address.publicPlace}, {appointment.requester.address.number}
                </div>
                <div className="text-gray-500">
                  {appointment.requester.address.street}, {appointment.requester.address.city} -{" "}
                  {appointment.requester.address.uf}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <Badge variant="outline">
                  {StatusHelper.getWasteTypeText(appointment.wasteItem.type)}
                </Badge>
                <div className="text-sm text-gray-500 mt-1">
                  {(appointment.optional_photo_url) ? appointment.optional_photo_url : 'Nenhuma foto anexada'}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(appointment.scheduled_at).toLocaleDateString()}
              </div>
            </TableCell>
            <TableCell>
              <Badge className={StatusHelper.getStatusColor(appointment.status)}>
                {StatusHelper.getStatusText(appointment.status)}
              </Badge>
            </TableCell>
            <TableCell>
              {appointment.employee ? (
                <div className="flex items-center gap-1">
                  <Truck className="h-4 w-4" />
                  {appointment.employee.name}
                </div>
              ) : (
                <span className="text-gray-400">Não atribuído</span>
              )}
            </TableCell>
            <TableCell>
              {!appointment.employee && (
                <Button
                  size="sm"
                  onClick={() => onAssignClick(appointment)}
                  className="flex items-center gap-1"
                >
                  <UserPlus className="h-4 w-4" />
                  Atribuir
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}