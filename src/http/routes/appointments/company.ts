export async function fetchCompanyAppointments(token: string) {
  const res = await fetch("http://localhost:8080/api/appointments/company", {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error("Erro ao carregar agendamentos")

  return res.json()
}
