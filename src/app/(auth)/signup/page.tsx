"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import { useSignupForm } from "@/hooks/useSignupForm"
import { StepProgress, PersonalDataStep, AddressStep, ConfirmationStep, STEPS_CONFIG } from "@/components/signup-steps"

// Componente de sucesso
function SuccessMessage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Cadastro Realizado!</h2>
            <p className="text-gray-600 mb-4">
              Sua conta foi criada com sucesso. Você será redirecionado para fazer login.
            </p>
          </div>
          <div className="animate-pulse">
            <div className="h-2 bg-green-200 rounded-full">
              <div className="h-2 bg-green-600 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Redirecionando para login...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignupPage() {
  const {
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
  } = useSignupForm()

  // Renderizar tela de sucesso
  if (isSuccess) {
    return <SuccessMessage />
  }

  // Handler para submissão com tratamento de erro
  const handleSubmit = async () => {
    try {
      await submitForm()
    } catch (error) {
      alert("Ocorreu um erro no cadastro. Tente novamente.")
    }
  }

  // Renderizar step atual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalDataStep
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
            passwordStrength={passwordStrength}
          />
        )
      case 1:
        return (
          <AddressStep
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
            isLoadingCEP={isLoadingCEP}
          />
        )
      case 2:
        return <ConfirmationStep formData={formData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mb-4">
            <Image
              src="/assets/coleta-verde.png?height=120&width=120"
              alt="Coleta Verde"
              width={120}
              height={120}
              priority
              className="mx-auto drop-shadow-lg"
            />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <CardTitle className="text-2xl font-bold text-green-800">Coleta Verde</CardTitle>
          </div>
          <p className="text-gray-600">Cadastre-se e contribua para um mundo mais sustentável</p>
        </CardHeader>

        <CardContent className="p-6">
          {/* Barra de progresso */}
          <StepProgress currentStep={currentStep} totalSteps={STEPS_CONFIG.length} />

          {/* Renderizar step atual */}
          {renderCurrentStep()}

          {/* Botões de navegação */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </Button>

            {currentStep < STEPS_CONFIG.length - 1 ? (
              <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                Próximo
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Finalizar Cadastro
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
