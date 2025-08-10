"use client"

import { useState } from "react"
import { Bell, Menu, User, LogOut, Building2, Plus, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import router from "next/router"

// Tipos assumidos
interface Empresa {
  id: string
  name: string
  logo?: string
}

interface CreateAppointmentFormProps {
  company: Empresa
  onClose: () => void
}

// Componente de formulário simplificado para demonstração
function CreateAppointmentForm({ company, onClose }: CreateAppointmentFormProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Novo Agendamento</h2>
      <p>Formulário para {company.name}</p>
      <Button onClick={onClose} className="mt-4">
        Fechar
      </Button>
    </div>
  )
}

interface CompanyHeaderProps {
  company: Empresa
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  const [notifications, setNotifications] = useState(2)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/signin")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-white to-green-50/30 backdrop-blur-sm shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Logo e Nome da Empresa */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white shadow-md">
              {company.logo ? (
                <img src={company.logo || "/placeholder.svg"} alt={company.name} className="h-6 w-6 rounded" />
              ) : (
                <Building2 className="h-4 w-4" />
              )}
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900">{company.name}</h1>
              <p className="text-xs text-gray-500">Painel de Controle</p>
            </div>
          </div>
        </div>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex items-center gap-2">
          <Button variant="ghost" className="text-green-700 hover:text-green-800 hover:bg-green-50 font-medium">
            Dashboard
          </Button>

          <Button
            variant="default"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden lg:inline">Criar Agendamento</span>
            <span className="lg:hidden">Criar</span>
          </Button>
        </nav>

        {/* Ações do Usuário */}
        <div className="flex items-center gap-2">
          {/* Notificações */}
          <Button variant="ghost" size="icon" className="relative hover:bg-green-50">
            <Bell className="h-5 w-5 text-gray-600" />
            {notifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500"
              >
                {notifications}
              </Badge>
            )}
          </Button>

          {/* Menu do Usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-green-50">
                <Avatar className="h-8 w-8 border-2 border-green-100">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback className="bg-green-600 text-white text-sm font-medium">
                    {company.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{company.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">empresa@exemplo.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menu Mobile */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-green-50">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-4 mt-6">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{company.name}</h2>
                    <p className="text-sm text-gray-500">Painel de Controle</p>
                  </div>
                </div>

                <nav className="flex flex-col gap-2">
                  <Button variant="ghost" className="justify-start text-green-700 hover:bg-green-50">
                    Dashboard
                  </Button>
                  <Button
                    onClick={() => {
                      setIsCreateOpen(true)
                      setIsMobileMenuOpen(false)
                    }}
                    className="justify-start bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Agendamento
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Sheet para o formulário de criação */}
        <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <SheetContent side="right" className="w-full max-w-md">
            <CreateAppointmentForm company={company} onClose={() => setIsCreateOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
