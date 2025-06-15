import { useState, useEffect } from 'react'
import { Appointment, Employee } from '@/types/index'
import { ApiService } from '@/services/ApiService'

export const useAppointments = (token: string) => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const apiService = new ApiService(token)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [appointmentsData, employeesData] = await Promise.all([
          apiService.fetchAppointments(),
          apiService.fetchEmployees()
        ])

        setAppointments(appointmentsData)
        setEmployees(employeesData)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setError("Erro ao carregar dados")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const assignAppointment = async (appointmentId: string, employeeId: string) => {
    try {
      const success = await apiService.assignAppointment(appointmentId, employeeId)
      
      if (success) {
        const employee = employees.find(emp => emp.id === employeeId)
        setAppointments(prev => 
          prev.map(apt => 
            apt.id === appointmentId 
              ? { ...apt, employee } 
              : apt
          )
        )
        return true
      }
      return false
    } catch (error) {
      console.error("Erro ao atribuir agendamento:", error)
      return false
    }
  }

  return {
    appointments,
    employees,
    loading,
    error,
    assignAppointment
  }
}