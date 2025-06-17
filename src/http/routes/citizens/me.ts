export async function fetchCitizenMe(token: string) {
  const res = await fetch("http://localhost:8080/api/citizens/me", {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error("Erro ao carregar dados do cidadão")

  return res.json()
}
