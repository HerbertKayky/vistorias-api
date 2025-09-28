import { ChecklistStatus } from '../types/checklist-status.type';

// Tipo local para evitar problemas de import
type Vehicle = {
  id: string;
  nome: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  proprietario: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface InspectionResponse {
  id: string;
  titulo: string;
  descricao?: string;
  status: string;
  dataInicio: Date;
  dataFim?: Date;
  tempoGasto?: number;
  observacoes?: string;
  vehicle: Vehicle;
  inspector: {
    id: string;
    name: string;
    email: string;
  };
  checklistItems: Array<{
    id: string;
    key: string;
    status: ChecklistStatus;
    comment?: string;
  }>;
}
