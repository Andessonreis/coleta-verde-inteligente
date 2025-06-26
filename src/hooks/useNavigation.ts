"use client"

import { useState } from "react"

export interface Coordinates {
  lat: number
  lng: number
}

export interface NavigationOptions {
  address: string
  coordinates?: Coordinates
  appPreference?: "google" | "waze" | "apple" | "browser"
}

export function useNavigation() {
  const [isNavigating, setIsNavigating] = useState(false)

  // Detectar se está em dispositivo móvel
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  // Detectar sistema operacional
  const getOS = () => {
    const userAgent = navigator.userAgent
    if (/android/i.test(userAgent)) return "android"
    if (/iPad|iPhone|iPod/.test(userAgent)) return "ios"
    return "desktop"
  }

  // Gerar URL do Google Maps
  const getGoogleMapsUrl = (options: NavigationOptions) => {
    const { address, coordinates } = options
    const baseUrl = isMobile() ? "https://maps.google.com/maps" : "https://www.google.com/maps"

    if (coordinates) {
      return `${baseUrl}?daddr=${coordinates.lat},${coordinates.lng}`
    }
    return `${baseUrl}?daddr=${encodeURIComponent(address)}`
  }

  // Gerar URL do Waze
  const getWazeUrl = (options: NavigationOptions) => {
    const { address, coordinates } = options

    if (coordinates) {
      return `https://waze.com/ul?ll=${coordinates.lat},${coordinates.lng}&navigate=yes`
    }
    return `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`
  }

  // Gerar URL do Apple Maps
  const getAppleMapsUrl = (options: NavigationOptions) => {
    const { address, coordinates } = options

    if (coordinates) {
      return `http://maps.apple.com/?daddr=${coordinates.lat},${coordinates.lng}`
    }
    return `http://maps.apple.com/?daddr=${encodeURIComponent(address)}`
  }

  // Abrir navegação
  const openNavigation = async (options: NavigationOptions) => {
    setIsNavigating(true)

    try {
      const os = getOS()
      const { appPreference } = options

      let url = ""

      // Determinar qual app usar baseado na preferência ou sistema
      if (appPreference === "waze") {
        url = getWazeUrl(options)
      } else if (appPreference === "apple" && os === "ios") {
        url = getAppleMapsUrl(options)
      } else if (appPreference === "google" || !appPreference) {
        url = getGoogleMapsUrl(options)
      } else {
        // Fallback para Google Maps
        url = getGoogleMapsUrl(options)
      }

      // Tentar abrir o app nativo primeiro (mobile)
      if (isMobile()) {
        // Para Android, tentar abrir app nativo
        if (os === "android" && appPreference !== "browser") {
          const nativeUrls = {
            google: `google.navigation:q=${options.coordinates ? `${options.coordinates.lat},${options.coordinates.lng}` : encodeURIComponent(options.address)}`,
            waze: `waze://?q=${encodeURIComponent(options.address)}`,
          }

          if (appPreference === "waze" && nativeUrls.waze) {
            try {
              window.location.href = nativeUrls.waze
              // Fallback para web se app não estiver instalado
              setTimeout(() => {
                window.open(url, "_blank")
              }, 1000)
              return
            } catch (error) {
              console.log("App nativo não disponível, usando versão web")
            }
          }

          if (appPreference === "google" && nativeUrls.google) {
            try {
              window.location.href = nativeUrls.google
              setTimeout(() => {
                window.open(url, "_blank")
              }, 1000)
              return
            } catch (error) {
              console.log("App nativo não disponível, usando versão web")
            }
          }
        }

        // Para iOS, os links web já abrem os apps nativos automaticamente
        if (os === "ios") {
          window.open(url, "_blank")
          return
        }
      }

      // Abrir versão web
      window.open(url, "_blank")
    } catch (error) {
      console.error("Erro ao abrir navegação:", error)
      // Fallback para Google Maps web
      const fallbackUrl = getGoogleMapsUrl(options)
      window.open(fallbackUrl, "_blank")
    } finally {
      setIsNavigating(false)
    }
  }

  // Função para mostrar opções de navegação
  const getAvailableApps = () => {
    const os = getOS()
    const apps = [
      { id: "google", name: "Google Maps", available: true },
      { id: "waze", name: "Waze", available: true },
    ]

    if (os === "ios") {
      apps.push({ id: "apple", name: "Apple Maps", available: true })
    }

    apps.push({ id: "browser", name: "Abrir no Navegador", available: true })

    return apps
  }

  return {
    openNavigation,
    getAvailableApps,
    isNavigating,
    isMobile: isMobile(),
    os: getOS(),
  }
}