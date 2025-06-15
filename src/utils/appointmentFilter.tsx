import { Appointment, FilterCriteria } from '@/types/index'

export class AppointmentFilter {
  static filter(appointments: Appointment[], criteria: FilterCriteria): Appointment[] {
    return appointments.filter(appointment => {
      const matchesSearch = this.matchesSearchCriteria(appointment, criteria.searchTerm)
      const matchesStatus = criteria.statusFilter === "all" || appointment.status === criteria.statusFilter
      const matchesWasteType = criteria.wasteTypeFilter === "all" || appointment.wasteItem.type === criteria.wasteTypeFilter

      return matchesSearch && matchesStatus && matchesWasteType
    })
  }

  private static matchesSearchCriteria(appointment: Appointment, searchTerm: string): boolean {
    const lowerSearchTerm = searchTerm.toLowerCase()
    return (
      appointment.requester.name.toLowerCase().includes(lowerSearchTerm) ||
      appointment.requester.email.toLowerCase().includes(lowerSearchTerm) ||
      appointment.wasteItem.description.toLowerCase().includes(lowerSearchTerm)
    )
  }
}