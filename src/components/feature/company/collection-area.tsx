"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Recycle, Leaf, BarChart3 } from "lucide-react"

export function CollectionArea() {
  const [activeTab, setActiveTab] = useState("hoje")

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center">
          <Recycle className="mr-2 h-5 w-5 text-green-600" />
          Atividade de Coleta
        </CardTitle>
        <CardDescription>Acompanhamento de coletas</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="hoje" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="hoje">Hoje</TabsTrigger>
            <TabsTrigger value="semana">Semana</TabsTrigger>
            <TabsTrigger value="mes">Mês</TabsTrigger>
          </TabsList>
          <TabsContent value="hoje" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span className="font-medium">3/5 coletas</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col p-3 border rounded-md">
                  <span className="text-xs text-muted-foreground">Peso coletado</span>
                  <div className="flex items-center mt-1">
                    <span className="text-lg font-bold">320</span>
                    <span className="text-xs ml-1">kg</span>
                  </div>
                </div>
                <div className="flex flex-col p-3 border rounded-md">
                  <span className="text-xs text-muted-foreground">Distância</span>
                  <div className="flex items-center mt-1">
                    <span className="text-lg font-bold">42</span>
                    <span className="text-xs ml-1">km</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Leaf className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-xs">Impacto ambiental positivo</span>
                </div>
                <Button variant="outline" size="sm" className="h-7">
                  <BarChart3 className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Detalhes</span>
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="semana" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span className="font-medium">18/25 coletas</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col p-3 border rounded-md">
                  <span className="text-xs text-muted-foreground">Peso coletado</span>
                  <div className="flex items-center mt-1">
                    <span className="text-lg font-bold">1.250</span>
                    <span className="text-xs ml-1">kg</span>
                  </div>
                </div>
                <div className="flex flex-col p-3 border rounded-md">
                  <span className="text-xs text-muted-foreground">Distância</span>
                  <div className="flex items-center mt-1">
                    <span className="text-lg font-bold">187</span>
                    <span className="text-xs ml-1">km</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="mes" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span className="font-medium">78/100 coletas</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col p-3 border rounded-md">
                  <span className="text-xs text-muted-foreground">Peso coletado</span>
                  <div className="flex items-center mt-1">
                    <span className="text-lg font-bold">5.430</span>
                    <span className="text-xs ml-1">kg</span>
                  </div>
                </div>
                <div className="flex flex-col p-3 border rounded-md">
                  <span className="text-xs text-muted-foreground">Distância</span>
                  <div className="flex items-center mt-1">
                    <span className="text-lg font-bold">720</span>
                    <span className="text-xs ml-1">km</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
