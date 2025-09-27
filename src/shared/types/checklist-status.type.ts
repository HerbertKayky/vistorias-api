// Enum para status do checklist
export enum ChecklistStatus {
  APROVADO = 'APROVADO',
  REPROVADO = 'REPROVADO',
  NAO_APLICAVEL = 'NAO_APLICAVEL'
}

export type ChecklistStatusType = keyof typeof ChecklistStatus;

