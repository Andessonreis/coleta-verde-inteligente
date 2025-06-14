import { Card, CardContent } from "@/components/ui/card"
import { ComponentType, SVGProps } from "react"

const cores = {
  green: "text-green-600",
  blue: "text-blue-600",
  red: "text-red-600",
  gray: "text-gray-600",
} as const

type Cor = keyof typeof cores

type StatusCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  valor: string | number
  label: string
  cor?: Cor
}

export function StatusCard({ icon: Icon, valor, label, cor = "gray" }: StatusCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-wrap items-center p-6 gap-4">
        <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${cores[cor]} flex-shrink-0`} />
        <div className="min-w-0">
          <p className="text-2xl font-bold truncate">{valor}</p>
          <p className="text-sm text-gray-600 truncate">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
