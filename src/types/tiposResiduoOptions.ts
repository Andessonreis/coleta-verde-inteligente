export type TipoResiduoValue =
  | 'ORGANIC'
  | 'RECYCLABLE'
  | 'ELECTRONIC'
  | 'HAZARDOUS'
  | 'CONSTRUCTION'
  | 'GENERAL'

export interface TipoResiduoOption {
  value: TipoResiduoValue
  label: string
  color: string
}

export const tiposResiduoOptions: TipoResiduoOption[] = [
  { value: 'ORGANIC', label: 'Orgânico', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'RECYCLABLE', label: 'Reciclável', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'ELECTRONIC', label: 'Eletrônico', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'HAZARDOUS', label: 'Perigoso', color: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'CONSTRUCTION', label: 'Construção', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { value: 'GENERAL', label: 'Geral', color: 'bg-gray-100 text-gray-800 border-gray-200' }
]
