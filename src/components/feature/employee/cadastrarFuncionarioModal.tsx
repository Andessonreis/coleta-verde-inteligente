"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CadastrarFuncionarioModal({ open, onOpenChange }: Props) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    registration: "",
    jobTitle: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const token = localStorage.getItem("token")

      const response = await fetch("http://localhost:8080/api/employees/employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error("Erro ao cadastrar funcionário.")
      }

      alert("Funcionário cadastrado com sucesso!")
      setForm({ email: "", password: "", username: "", registration: "", jobTitle: "" })
      onOpenChange(false)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Funcionário</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>Email</Label>
            <Input name="email" value={form.email} onChange={handleChange} type="email" />
          </div>

          <div className="space-y-1">
            <Label>Senha</Label>
            <Input name="password" value={form.password} onChange={handleChange} type="password" />
          </div>

          <div className="space-y-1">
            <Label>Nome de Usuário</Label>
            <Input name="username" value={form.username} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <Label>Matrícula</Label>
            <Input name="registration" value={form.registration} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <Label>Cargo</Label>
            <Input name="jobTitle" value={form.jobTitle} onChange={handleChange} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
