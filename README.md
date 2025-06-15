# 🟢 Coleta Verde Inteligente - Frontend

Interface web do sistema de agendamento de coleta de resíduos urbanos. Este projeto foi desenvolvido com **TypeScript**, **React**, **Next.js** e **Tailwind CSS v4**, visando proporcionar uma experiência simples e acessível para os cidadãos realizarem agendamentos de coleta.

> 🔗 Acesse o repositório do [Backend aqui](https://github.com/Andessonreis/coleta-verde)

---

## 📑 Tabela de Conteúdos

- [📝 Introdução](#-introdução)
- [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [⚙️ Funcionalidades](#️-funcionalidades)
- [📦 Instalação e Execução](#-instalação-e-execução)
- [🔧 Configuração](#-configuração)
- [📸 Capturas de Tela](#-capturas-de-tela)
- [🌐 Comunicação com a API](#-comunicação-com-a-api)
- [📄 Licença](#-licença)

---

## 📝 Introdução

A interface web do **Coleta Verde Inteligente** permite que cidadãos agendem a coleta de resíduos como móveis, eletrodomésticos, eletrônicos e recicláveis diretamente de suas casas. A plataforma é responsiva e acessível, pensada para uso em dispositivos móveis e desktops.

---

## 🚀 Tecnologias Utilizadas

- **TypeScript**
- **React**
- **Next.js**
- **Tailwind CSS v4**
- **React Hook Form**
---

## ⚙️ Funcionalidades

- 🗓️ Agendamento de coleta com seleção de endereço, tipo de resíduo e envio de foto
- 📅 Consulta de datas disponíveis para coleta
- ✏️ Gerenciamento de agendamentos (visualização e cancelamento)
- 📥 Notificações por e-mail sobre status do agendamento
- 👨‍💼 Área administrativa (se implementada)

---

## 📦 Instalação e Execução

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Passos para rodar localmente

```bash
# Clone o repositório
git clone https://github.com/Andessonreis/coleta-verde-inteligente.git

# Acesse o diretório
cd coleta-verde-inteligente

# Instale as dependências
npm install
# ou
yarn install

# Rode o projeto
npm run dev
# ou
yarn dev
````

---

## 📸 Capturas de Tela


---

## 🌐 Comunicação com a API

O frontend se comunica com a API backend por meio de requisições REST. As rotas estão centralizadas em um serviço (`services/api.ts`).


---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).