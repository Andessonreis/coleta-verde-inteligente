import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Appointment, Employee } from '@/types/index'

interface AssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
  employees: Employee[]
  selectedEmployee: string
  onEmployeeChange: (employeeId: string) => void
  onConfirm: () => void
}

export const AssignmentDialog: React.FC<AssignmentDialogProps> = ({
  open,
  onOpenChange,
  appointment,
  employees,
  selectedEmployee,
  onEmployeeChange,
  onConfirm
}) => {
  const availableEmployees = employees.filter(emp => emp.status === "ACTIVE")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Atribuir Funcionário</DialogTitle>
          <DialogDescription>
            Selecione um funcionário para realizar a coleta de resíduo solicitada por{" "}
            <strong>{appointment?.requester.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="employee">Funcionário</Label>
            <Select value={selectedEmployee} onValueChange={onEmployeeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um funcionário" />
              </SelectTrigger>
              <SelectContent>
                {availableEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} - {employee.jobTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={!selectedEmployee}>
            Atribuir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
