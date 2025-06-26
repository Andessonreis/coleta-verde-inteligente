import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Recycle, Shield, Smartphone, Truck, Users, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/assets/coleta-verde.png"
              alt="Coleta Verde"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#funcionalidades" className="text-gray-600 hover:text-green-600 transition-colors">
              Funcionalidades
            </Link>
            <Link href="#como-funciona" className="text-gray-600 hover:text-green-600 transition-colors">
              Como Funciona
            </Link>
            <Link href="#contato" className="text-gray-600 hover:text-green-600 transition-colors">
              Contato
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/signin">
              <Button variant="outline" className="bg-white text-green-600 border-green-600 hover:bg-green-50">
                Entrar
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Cadastrar-se
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge className="bg-green-500 text-white px-3 py-1">Sistema Inteligente de Coleta</Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">Coleta Verde Inteligente</h1>
                <p className="text-xl text-green-100 leading-relaxed">
                  Agende facilmente a coleta de resíduos urbanos como móveis, eletrodomésticos e recicláveis. Promovendo
                  organização, eficiência e descarte consciente em sua cidade.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                    <Calendar className="mr-2 h-5 w-5" />
                    Agendar Coleta
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-green-600"
                  >
                    Saiba Mais
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <Truck className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Agendamento Fácil</h3>
                        <p className="text-green-100 text-sm">Em apenas 3 etapas simples</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Notificações</h3>
                        <p className="text-green-100 text-sm">Confirmações por e-mail e SMS</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <Smartphone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Acesso Mobile</h3>
                        <p className="text-green-100 text-sm">Responsivo para todos os dispositivos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Funcionalidades */}
        <section id="funcionalidades" className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Funcionalidades Principais</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Um sistema completo para gerenciar a coleta de resíduos urbanos de forma eficiente e sustentável
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-green-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-green-900">Agendamento Inteligente</CardTitle>
                  <CardDescription>
                    Agende coletas com data, tipo de material e endereço. Sistema valida disponibilidade e regras
                    automaticamente.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-green-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Recycle className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-green-900">Tipos de Resíduos</CardTitle>
                  <CardDescription>
                    Coleta de móveis, eletrodomésticos, eletrônicos, recicláveis e entulhos de até 1m³ conforme
                    regulamentação.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-green-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-green-900">Notificações</CardTitle>
                  <CardDescription>
                    Receba confirmações, lembretes e atualizações por e-mail sobre seus agendamentos e status das
                    coletas.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-green-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-green-900">Gestão por Região</CardTitle>
                  <CardDescription>
                    Sistema organiza coletas por região com limite diário de agendamentos para otimizar rotas e
                    recursos.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-green-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-green-900">Controle de Regras</CardTitle>
                  <CardDescription>
                    Validação automática de regras: um agendamento por residência a cada 30 dias, antecedência mínima de
                    24h.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-green-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-green-900">Painel Administrativo</CardTitle>
                  <CardDescription>
                    Funcionários podem visualizar agendamentos, organizar rotas e registrar ocorrências de coleta.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section id="como-funciona" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Como Funciona</h2>
              <p className="text-xl text-gray-600">Processo simples em 3 etapas para agendar sua coleta</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Escolha o Tipo de Resíduo</h3>
                <p className="text-gray-600">
                  Selecione o tipo de material que deseja descartar: móveis, eletrônicos, recicláveis ou entulho.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Informe o Endereço</h3>
                <p className="text-gray-600">
                  Digite seu endereço completo. O sistema verificará se há agendamentos disponíveis para sua região.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirme o Agendamento</h3>
                <p className="text-gray-600">
                  Escolha a data disponível e confirme. Você receberá uma confirmação por e-mail imediatamente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Estatísticas */}
        <section className="py-20 bg-green-600 text-white">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-green-100">Agendamentos Realizados</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-green-100">Bairros Atendidos</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-green-100">Satisfação dos Usuários</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24h</div>
                <div className="text-green-100">Tempo de Resposta</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Pronto para Começar?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Faça parte da mudança! Cadastre-se agora e contribua para uma cidade mais limpa e sustentável.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                    <Users className="mr-2 h-5 w-5" />
                    Cadastrar-se
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                    Sou Funcionário da Prefeitura
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/assets/coleta-verde.png"
                alt="Coleta Verde"
                width={120}
                height={40}
                className="h-10 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-gray-400">
                Sistema inteligente de agendamento de coleta de resíduos urbanos para uma cidade mais sustentável.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Links Úteis</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Como Funciona
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Tipos de Resíduos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Regras de Coleta
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Reportar Problema
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <div className="space-y-2 text-gray-400">
                <p>📧 contato@coletaverde.gov.br</p>
                <p>📞 (11) 3000-0000</p>
                <p>📍 Prefeitura Municipal</p>
                <p>🕒 Seg-Sex: 8h às 17h</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Coleta Verde Inteligente. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
