import { Appointment, Employee, AppointmentStats } from '@/types/index'

export class StatsCalculator {
  static calculate(appointments: Appointment[], employees: Employee[]): AppointmentStats {
    return {
      totalAppointments: appointments.length,
      scheduledAppointments: appointments.filter(a => a.status === "SCHEDULED").length,
      completedAppointments: appointments.filter(a => a.status === "COMPLETED").length,
      totalEmployees: employees.length,
      activeEmployees: employees.filter(e => e.status === "ACTIVE").length,
      assignedAppointments: appointments.filter(a => a.employee).length,
    }
  }
}