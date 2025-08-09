export async function fetchCompanyMe(token: string) {
  const res = await fetch("http://localhost:8080/api/companies/me", {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error("Erro ao carregar dados da empresa")

  return res.json()
}
