"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Navigation, MapPin, Smartphone, Globe, Car } from "lucide-react"
import { useNavigation, type NavigationOptions } from "@/hooks/useNavigation"

interface NavigationDialogProps {
  isOpen: boolean
  onClose: () => void
  address: string
  coordinates?: { lat: number; lng: number }
  title?: string
}

export function NavigationDialog({
  isOpen,
  onClose,
  address,
  coordinates,
  title = "Escolha como navegar",
}: NavigationDialogProps) {
  const { openNavigation, getAvailableApps, isNavigating, isMobile, os } = useNavigation()
  const [selectedApp, setSelectedApp] = useState<string>("")

  const handleNavigate = async (appId: string) => {
    const options: NavigationOptions = {
      address,
      coordinates,
      appPreference: appId as any,
    }

    await openNavigation(options)
    onClose()
  }

  const getAppIcon = (appId: string) => {
    switch (appId) {
      case "google":
        return <Globe className="h-5 w-5" />
      case "waze":
        return <Car className="h-5 w-5" />
      case "apple":
        return <MapPin className="h-5 w-5" />
      case "browser":
        return <Globe className="h-5 w-5" />
      default:
        return <Navigation className="h-5 w-5" />
    }
  }

  const getAppDescription = (appId: string) => {
    switch (appId) {
      case "google":
        return isMobile ? "Abrir no app Google Maps" : "Abrir Google Maps no navegador"
      case "waze":
        return isMobile ? "Abrir no app Waze" : "Abrir Waze no navegador"
      case "apple":
        return "Abrir no Apple Maps"
      case "browser":
        return "Abrir no navegador web"
      default:
        return "Navegação"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>Selecione o aplicativo de navegação de sua preferência</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do destino */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Destino:</p>
                <p className="text-sm text-gray-600">{address}</p>
                {coordinates && (
                  <p className="text-xs text-gray-500 mt-1">
                    Coordenadas: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Informações do dispositivo */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Smartphone className="h-3 w-3" />
            <span>
              {isMobile ? "Dispositivo móvel" : "Desktop"} • {os.toUpperCase()}
            </span>
            {isMobile && (
              <Badge variant="outline" className="text-xs">
                Apps nativos disponíveis
              </Badge>
            )}
          </div>

          {/* Opções de navegação */}
          <div className="grid gap-2">
            {getAvailableApps().map((app) => (
              <Button
                key={app.id}
                variant="outline"
                className="justify-start h-auto p-3"
                onClick={() => handleNavigate(app.id)}
                disabled={isNavigating}
              >
                <div className="flex items-center gap-3 w-full">
                  {getAppIcon(app.id)}
                  <div className="text-left">
                    <p className="font-medium">{app.name}</p>
                    <p className="text-xs text-gray-500">{getAppDescription(app.id)}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {/* Navegação rápida (botão principal) */}
          <div className="border-t pt-4">
            <Button
              onClick={() => handleNavigate("google")}
              disabled={isNavigating}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isNavigating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Abrindo navegação...
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Navegar Agora (Google Maps)
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
