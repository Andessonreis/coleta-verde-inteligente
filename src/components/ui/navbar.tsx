"use client"

import { useState } from "react"
import Image from "next/image"

export default function Navbar({ onNovoAgendamento }: { onNovoAgendamento: () => void }) {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-6 py-4 mb-8 shadow-sm">
      {/* Container mais à esquerda, sem max-w e sem centralizar */}
      <div className="flex items-center justify-between px-2">
        {/* Logo + Título */}
        <div className="flex items-center gap-4">
          <div className="rounded-lg">
            <Image
              src="/coleta-verde-header-logo.png"
              alt="Logo Coleta Verde"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
              priority
            />
          </div>
          <div>
            <span className="text-xl font-light text-gray-800 tracking-wide">Coleta Verde</span>
            <div className="w-8 h-0.5 bg-emerald-500 mt-0.5"></div>
          </div>
        </div>

        {/* Botão hambúrguer (mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="text-gray-600 hover:text-gray-800 focus:outline-none transition-colors p-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {menuAberto ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu completo (desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={onNovoAgendamento}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
          >
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Menu mobile dropdown */}
      {menuAberto && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => {
              onNovoAgendamento()
              setMenuAberto(false)
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
          >
            Novo Agendamento
          </button>
        </div>
      )}
    </nav>
  )
}
