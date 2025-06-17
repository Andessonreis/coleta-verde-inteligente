"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Eye, EyeOff, Loader2, User, MapPin, CheckCircle, Leaf } from "lucide-react"
import { CircleAlertIcon } from "lucide-react"

import { useState } from "react"
import type { FormData } from "@/hooks/useSignupForm"

// Interfaces para props dos componentes
interface StepProps {
  formData: FormData
  errors: Record<string, string>
  updateFormData: (field: keyof FormData, value: string) => void
}

interface PersonalDataStepProps extends StepProps {
  passwordStrength: number
}

interface AddressStepProps extends StepProps {
  isLoadingCEP: boolean
}

interface ConfirmationStepProps {
  formData: FormData
}

interface StepProgressProps {
  currentStep: number
  totalSteps: number
}

// Configuração dos steps
export const STEPS_CONFIG = [
  {
    title: "Dados Pessoais",
    description: "Informações básicas da sua conta",
    icon: User,
  },
  {
    title: "Endereço",
    description: "Onde realizaremos as coletas",
    icon: MapPin,
  },
  {
    title: "Confirmação",
    description: "Revise seus dados",
    icon: CheckCircle,
  },
]

// Componente de progresso dos steps
export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {STEPS_CONFIG.map((step, index) => {
          const StepIcon = step.icon
          return (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  index < currentStep
                    ? "bg-green-600 text-white"
                    : index === currentStep
                      ? "bg-green-100 text-green-600 border-2 border-green-600"
                      : "bg-gray-200 text-gray-400"
                }`}
              >
                <StepIcon className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium">{step.title}</p>
                <p className="text-xs text-gray-500 hidden sm:block">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>
      <Progress value={((currentStep + 1) / totalSteps) * 100} className="h-2" />
    </div>
  )
}

// Componente para indicador de força da senha
function PasswordStrengthIndicator({ strength, password }: { strength: number; password: string }) {
  const getStrengthColor = () => {
    switch (strength) {
      case 1:
        return "bg-red-500"
      case 2:
        return "bg-yellow-500"
      case 3:
        return "bg-blue-500"
      case 4:
        return "bg-green-500"
      default:
        return "bg-gray-300"
    }
  }

  const getStrengthText = () => {
    switch (strength) {
      case 1:
        return "Fraca"
      case 2:
        return "Média"
      case 3:
        return "Forte"
      case 4:
        return "Muito Forte"
      default:
        return ""
    }
  }

  if (!password) return null

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(strength / 4) * 100}%` }}
          />
        </div>
        {strength > 0 && (
          <Badge variant="outline" className="text-xs">
            {getStrengthText()}
          </Badge>
        )}
      </div>
    </div>
  )
}

// Step 1: Dados Pessoais
export function PersonalDataStep({ formData, errors, updateFormData, passwordStrength }: PersonalDataStepProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Dados Pessoais</h3>

      <div>
        <Label htmlFor="username">Nome Completo</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateFormData("name", e.target.value)}
          className={errors.username ? "border-red-500" : ""}
        />
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
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
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => updateFormData("phone", e.target.value)}
          placeholder="(11) 99999-9999"
          maxLength={15}
          className={errors.phone ? "border-red-500" : ""}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div>
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            className={errors.password ? "border-red-500" : ""}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <PasswordStrengthIndicator strength={passwordStrength} password={formData.password} />
        {errors.password && (
              <div className="mt-2 rounded-md border border-red-500/50 px-4 py-3 text-red-600">
                <div className="flex gap-3">
                  <CircleAlertIcon
                    className="mt-0.5 shrink-0 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium">
                    {errors.password}
                  </p>
                </div>
              </div>
            )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => updateFormData("confirmPassword", e.target.value)}
            className={errors.confirmPassword ? "border-red-500" : ""}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.confirmPassword && (
          <div className="mt-2 rounded-md border border-red-500/50 px-4 py-3 text-red-600">
            <div className="flex gap-3">
              <CircleAlertIcon
                className="mt-0.5 shrink-0 opacity-60"
                size={16}
                aria-hidden="true"
              />
              <p className="text-sm font-medium">
                {errors.confirmPassword}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Step 2: Endereço
export function AddressStep({ formData, errors, updateFormData, isLoadingCEP }: AddressStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Endereço para Coleta</h3>

      <div>
        <Label htmlFor="zipCode">CEP</Label>
        <div className="relative">
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => updateFormData("zipCode", e.target.value)}
            placeholder="00000-000"
            maxLength={9}
            className={errors.zipCode ? "border-red-500" : ""}
          />
          {isLoadingCEP && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />}
        </div>
        {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="publicPlace">Logradouro</Label>
          <Input
            id="publicPlace"
            value={formData.publicPlace}
            onChange={(e) => updateFormData("publicPlace", e.target.value)}
            className={errors.publicPlace ? "border-red-500" : ""}
          />
          {errors.publicPlace && <p className="text-red-500 text-sm mt-1">{errors.publicPlace}</p>}
        </div>

        <div>
          <Label htmlFor="street">Bairro</Label>
          <Input
            id="street"
            value={formData.street}
            onChange={(e) => updateFormData("street", e.target.value)}
            className={errors.street ? "border-red-500" : ""}
          />
          {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            value={formData.number}
            onChange={(e) => updateFormData("number", e.target.value)}
            className={errors.number ? "border-red-500" : ""}
          />
          {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
        </div>

        <div>
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            value={formData.complement}
            onChange={(e) => updateFormData("complement", e.target.value)}
            placeholder="Opcional"
          />
        </div>

        <div>
          <Label htmlFor="uf">UF</Label>
          <Input
            id="uf"
            value={formData.uf}
            onChange={(e) => updateFormData("uf", e.target.value)}
            maxLength={2}
            className={errors.uf ? "border-red-500" : ""}
          />
          {errors.uf && <p className="text-red-500 text-sm mt-1">{errors.uf}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="city">Cidade</Label>
        <Input
          id="city"
          value={formData.city}
          onChange={(e) => updateFormData("city", e.target.value)}
          className={errors.city ? "border-red-500" : ""}
        />
        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
      </div>
    </div>
  )
}

// Step 3: Confirmação
export function ConfirmationStep({ formData }: ConfirmationStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Confirme seus dados</h3>

      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div>
          <h4 className="font-medium text-gray-700">Dados Pessoais</h4>
          <p className="text-sm text-gray-600">Nome: {formData.name}</p>
          <p className="text-sm text-gray-600">Email: {formData.email}</p>
          <p className="text-sm text-gray-600">Telefone: {formData.phone}</p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700">Endereço</h4>
          <p className="text-sm text-gray-600">
            {formData.publicPlace}, {formData.number}
            {formData.complement && ` - ${formData.complement}`}
          </p>
          <p className="text-sm text-gray-600">
            {formData.street}, {formData.city} - {formData.uf}
          </p>
          <p className="text-sm text-gray-600">CEP: {formData.zipCode}</p>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-start gap-3">
          <Leaf className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-800">Bem-vindo ao Coleta Verde!</h4>
            <p className="text-sm text-green-700">
              Após o cadastro, você poderá agendar coletas de diferentes tipos de resíduos e contribuir para um meio
              ambiente mais sustentável.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
