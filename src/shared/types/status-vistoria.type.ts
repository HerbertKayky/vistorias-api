// Enum para status de vistoria
export enum StatusVistoria {
  PENDENTE = 'PENDENTE',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  APROVADA = 'APROVADA',
  REPROVADA = 'REPROVADA',
  CANCELADA = 'CANCELADA'
}

export type StatusVistoriaType = keyof typeof StatusVistoria;
