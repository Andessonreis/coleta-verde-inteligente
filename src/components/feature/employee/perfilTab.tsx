import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, Truck, Calendar, Star } from "lucide-react"
import { PerfilFuncionario } from "@/types/funcionario"

type Props = {
  perfil: PerfilFuncionario
}

export function PerfilTab({ perfil }: Props) {
  if (!perfil) return null

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      <InformacoesPessoais perfil={perfil} />
      <Estatisticas perfil={perfil} />
    </div>
  )
}

function InformacoesPessoais({ perfil }: { perfil: PerfilFuncionario }) {
  const fallback = perfil.nome
    ? perfil.nome
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
    : "?"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={perfil.avatar || "/placeholder.svg"}
              alt={perfil.nome}
            />
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{perfil.nome}</h3>
            <p className="text-gray-600">{perfil.cargo}</p>
          </div>
        </div>

        <div className="space-y-2">
          <InfoItem icon={Mail} texto={perfil.email} />
          <InfoItem icon={Phone} texto={perfil.telefone || "-"} />
          <InfoItem icon={Truck} texto={`Setor: ${perfil.setor || "-"}`} />
          <InfoItem
            icon={Calendar}
            texto={`Admissão: ${
              perfil.dataAdmissao
                ? new Date(perfil.dataAdmissao).toLocaleDateString("pt-BR")
                : "-"
            }`}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function Estatisticas({ perfil }: { perfil: PerfilFuncionario }) {
  const estatisticas = perfil.estatisticas ?? {
    coletasRealizadas: 0,
    coletasHoje: 0,
    avaliacaoMedia: 0,
  }

  const stats = [
    {
      label: "Coletas Realizadas",
      valor: estatisticas.coletasRealizadas,
      cor: "text-green-600",
    },
    {
      label: "Coletas Hoje",
      valor: estatisticas.coletasHoje,
      cor: "text-blue-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{stat.label}</span>
              <span className={`text-2xl font-bold ${stat.cor}`}>
                {stat.valor}
              </span>
            </div>
          ))}

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Avaliação Média</span>
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="text-2xl font-bold text-yellow-600">
                {estatisticas.avaliacaoMedia.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function InfoItem({
  icon: Icon,
  texto,
}: {
  icon: React.ElementType
  texto: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-gray-500" />
      <span className="text-sm">{texto}</span>
    </div>
  )
}
