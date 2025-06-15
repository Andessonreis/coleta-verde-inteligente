"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// Interfaces
export interface FormData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  zipCode: string
  publicPlace: string
  street: string
  number: string
  complement: string
  city: string
  uf: string
}

interface ViaCEPResponse {
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

// Hook customizado para gerenciar o formulário de signup
export function useSignupForm() {
  const router = useRouter()
  // Estados
  // Estados
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    zipCode: "",
    publicPlace: "",
    street: "",
    number: "",
    complement: "",
    city: "",
    uf: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoadingCEP, setIsLoadingCEP] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Utilitários de formatação
  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }

  const formatCEP = (value: string): string => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{5})(\d{3})/, "$1-$2")
  }

  // Cálculo da força da senha
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0
    if (password.length >= 6) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    return strength
  }

  // Busca de endereço por CEP
  const fetchAddressByCEP = async (cep: string): Promise<void> => {
    const cleanCEP = cep.replace(/\D/g, "")
    if (cleanCEP.length === 8) {
      setIsLoadingCEP(true)
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
        const data: ViaCEPResponse = await response.json()

        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            publicPlace: data.logradouro || "",
            street: data.bairro || "",
            city: data.localidade || "",
            uf: data.uf || "",
          }))
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error)
      } finally {
        setIsLoadingCEP(false)
      }
    }
  }

  // Atualização de dados do formulário
  const updateFormData = (field: keyof FormData, value: string): void => {
    let formattedValue = value

    // Aplicar formatação específica
    if (field === "phone") {
      formattedValue = formatPhone(value)
    } else if (field === "zipCode") {
      formattedValue = formatCEP(value)
    } else if (field === "uf") {
      formattedValue = value.toUpperCase()
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }))

    // Limpar erro do campo
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }

    // Buscar CEP automaticamente
    if (field === "zipCode" && formattedValue.replace(/\D/g, "").length === 8) {
      fetchAddressByCEP(formattedValue)
    }
  }

  // Validação por step
  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (stepIndex === 0) {
      if (!formData.name.trim()) newErrors.name = "Nome é obrigatório"
      if (!formData.email.trim()) {
        newErrors.email = "Email é obrigatório"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Email inválido"
      }
      if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório"
      if (!formData.password.trim()) {
        newErrors.password = "Senha é obrigatória"
      } else if (formData.password.length < 6) {
        newErrors.password = "Senha deve ter pelo menos 6 caracteres"
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Senhas não coincidem"
      }
    }

    if (stepIndex === 1) {
      if (!formData.zipCode.trim()) newErrors.zipCode = "CEP é obrigatório"
      if (!formData.publicPlace.trim()) newErrors.publicPlace = "Logradouro é obrigatório"
      if (!formData.street.trim()) newErrors.street = "Bairro é obrigatório"
      if (!formData.number.trim()) newErrors.number = "Número é obrigatório"
      if (!formData.city.trim()) newErrors.city = "Cidade é obrigatória"
      if (!formData.uf.trim()) newErrors.uf = "UF é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Navegação entre steps
  const nextStep = (): void => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 2))
    }
  }

  const prevStep = (): void => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const goToStep = (step: number): void => {
    setCurrentStep(Math.max(0, Math.min(step, 2)))
  }

  // Submissão do formulário
  const submitForm = async (): Promise<void> => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)

    const payload = {
      name: formData.name,
      password: formData.password,
      email: formData.email,
      phone: formData.phone.replace(/\D/g, ""),
      address: {
        publicPlace: formData.publicPlace,
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
        city: formData.city,
        uf: formData.uf,
        zipCode: formData.zipCode.replace(/\D/g, ""),
      },
    }
      try {
        const response = await fetch("http://localhost:8080/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
  
        if (!response.ok) {
          throw new Error("Erro no cadastro")
        }
  
        setIsSuccess(true)
  
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          router.push("/signin")
        }, 2000)
      } catch (error) {
        console.error("Erro:", error)
        throw error
      } finally {
        setIsSubmitting(false)
      }
    }

  

  // Reset do formulário
  const resetForm = (): void => {
    setIsSuccess(false)
    setCurrentStep(0)
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      zipCode: "",
      publicPlace: "",
      street: "",
      number: "",
      complement: "",
      city: "",
      uf: "",
    })
    setErrors({})
  }

  // Efeito para calcular força da senha
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password))
  }, [formData.password])

  // Retorno do hook
  return {
    // Estados
    currentStep,
    formData,
    errors,
    isSubmitting,
    isSuccess,
    isLoadingCEP,
    passwordStrength,

    // Ações
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    submitForm,
    resetForm,
    validateStep,

    // Utilitários
    formatPhone,
    formatCEP,
    calculatePasswordStrength,
  }
}
