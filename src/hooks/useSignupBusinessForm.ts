"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export interface FormData {
  name: string
  cnpj: string
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

export function useSignupForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    cnpj: "",
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

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 10) return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }

  const formatCEP = (value: string) => value.replace(/\D/g, "").replace(/(\d{5})(\d{3})/, "$1-$2")

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0
    if (password.length >= 6) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    return strength
  }

  const fetchAddressByCEP = async (cep: string) => {
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

  const updateFormData = (field: keyof FormData, value: string) => {
    let formattedValue = value
    if (field === "phone") formattedValue = formatPhone(value)
    else if (field === "zipCode") formattedValue = formatCEP(value)
    else if (field === "uf") formattedValue = value.toUpperCase()

    setFormData((prev) => ({ ...prev, [field]: formattedValue }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
    if (field === "zipCode" && formattedValue.replace(/\D/g, "").length === 8) fetchAddressByCEP(formattedValue)
  }

  const validateStep = (stepIndex: number) => {
    const newErrors: Record<string, string> = {}

    if (stepIndex === 0) {
      if (!formData.name.trim()) newErrors.nomeFantasia = "Nome Fantasia é obrigatório"
      if (!formData.cnpj.trim()) newErrors.cnpj = "CNPJ é obrigatório"
      if (!formData.email.trim()) newErrors.email = "Email é obrigatório"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email inválido"
      if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório"
      if (!formData.password.trim()) newErrors.password = "Senha é obrigatória"
      else if (formData.password.length < 6) newErrors.password = "Senha deve ter pelo menos 6 caracteres"
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Senhas não coincidem"
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

  const nextStep = () => { if (validateStep(currentStep)) setCurrentStep((prev) => Math.min(prev + 1, 2)) }
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const submitForm = async () => {
    if (!validateStep(currentStep)) return
    setIsSubmitting(true)

    const payload = {
      name: formData.name,
      cnpj: formData.cnpj.replace(/\D/g, ""),
      email: formData.email,
      phone: formData.phone.replace(/\D/g, ""),
      password: formData.password,
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
      const response = await fetch("http://localhost:8080/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),

      })
      if (!response.ok) throw new Error("Erro no cadastro")
      setIsSuccess(true)
      setTimeout(() => router.push("/signin"), 2000)
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => { setPasswordStrength(calculatePasswordStrength(formData.password)) }, [formData.password])

  return {
    currentStep,
    formData,
    errors,
    isSubmitting,
    isSuccess,
    isLoadingCEP,
    passwordStrength,
    updateFormData,
    nextStep,
    prevStep,
    submitForm,
    validateStep,
    formatPhone,
    formatCEP,
  }
}
