export async function fetchCitizenAppointments(token: string) {
  const res = await fetch("http://localhost:8080/api/appointments/citizen", {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error("Erro ao carregar agendamentos")

  return res.json()
}
