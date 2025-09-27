import { StatusVistoria } from '../types/status-vistoria.type';

export interface OverviewReport {
  total: number;
  aprovadas: number;
  reprovadas: number;
  tempoMedio: number; // em minutos
  periodo: {
    from: string;
    to: string;
  };
}

export interface InspectorMetrics {
  inspectorId: string;
  inspectorName: string;
  inspectorEmail: string;
  total: number;
  aprovadas: number;
  reprovadas: number;
  tempoMedio: number; // em minutos
  status: {
    [key in StatusVistoria]: number;
  };
}

export interface VistoriaSummary {
  id: string;
  titulo: string;
  status: StatusVistoria;
  dataInicio: Date;
  dataFim?: Date;
  tempoGasto?: number;
  inspectorName: string;
}
