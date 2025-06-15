import { Appointment, Employee } from '@/types/index'

export class ApiService {
  private token: string

  constructor(token: string) {
    this.token = token
  }

  private getHeaders() {
    return {
      "Authorization": `Bearer ${this.token}`,
      "Content-Type": "application/json"
    }
  }

  async fetchAppointments(): Promise<Appointment[]> {
    const response = await fetch("http://localhost:8080/api/appointments", {
      headers: this.getHeaders(),
    })
    if (!response.ok) {
      throw new Error('Failed to fetch appointments')
    }
    return response.json()
  }

  async fetchEmployees(): Promise<Employee[]> {
    const response = await fetch("http://localhost:8080/api/employees", {
      headers: this.getHeaders(),
    })
    if (!response.ok) {
      throw new Error('Failed to fetch employees')
    }
    return response.json()
  }

  async assignAppointment(appointmentId: string, employeeId: string): Promise<boolean> {
    const response = await fetch("http://localhost:8080/api/appointments/assign", {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify({
        appointmentId,
        employeeId,
      }),
    })
    return response.ok
  }
}