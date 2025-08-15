"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import type { FormData } from "@/hooks/useSignupBusinessForm"
//import { CompanyDataStep } from "@/components/feature/company/company-data-step"

interface BusinessDataStepProps {
  formData: FormData
  errors: Record<string, string>
  updateFormData: (field: keyof FormData, value: string) => void
}

export function BusinessDataStep({ formData, errors, updateFormData }: BusinessDataStepProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Dados da Empresa</h3>

      <div>
        <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
        <Input
          id="nomeFantasia"
          value={formData.nomeFantasia}
          onChange={(e) => updateFormData("nomeFantasia", e.target.value)}
          className={errors.nomeFantasia ? "border-red-500" : ""}
        />
      </div>

      <div>
        <Label htmlFor="cnpj">CNPJ</Label>
        <Input
          id="cnpj"
          value={formData.cnpj}
          onChange={(e) => updateFormData("cnpj", e.target.value)}
          className={errors.cnpj ? "border-red-500" : ""}
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData("email", e.target.value)}
          className={errors.email ? "border-red-500" : ""}
        />
      </div>

      <div>
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => updateFormData("phone", e.target.value)}
          className={errors.phone ? "border-red-500" : ""}
        />
      </div>

      <div>
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
          />
          <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => updateFormData("confirmPassword", e.target.value)}
          />
          <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}