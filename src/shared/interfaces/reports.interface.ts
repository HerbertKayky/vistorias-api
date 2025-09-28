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

export interface InspectionReportData {
  id: string;
  titulo: string;
  status: string; // Usando string para compatibilidade com Prisma enum
  dataInicio: string;
  dataFim: string | null;
  tempoGasto: number;
  observacoes: string;
  veiculo: {
    nome: string;
    placa: string;
    marca: string;
    modelo: string;
    ano: number;
    proprietario: string;
  };
  inspector: {
    nome: string;
    email: string;
  };
  checklist: {
    totalItens: number;
    itensAprovados: number;
    itensReprovados: number;
    itensNaoAplicaveis: number;
  };
}

export interface InspectionsReportResponse {
  periodo: {
    from: string;
    to: string;
  };
  total: number;
  vistorias: InspectionReportData[];
}

export interface InspectorReportData {
  id: string;
  nome: string;
  email: string;
  totalVistorias: number;
  aprovadas: number;
  reprovadas: number;
  pendentes: number;
  emAndamento: number;
  canceladas: number;
  tempoMedio: number;
  taxaAprovacao: number;
}

export interface InspectorsReportResponse {
  total: number;
  inspetores: InspectorReportData[];
}

export interface BrandReportData {
  marca: string;
  totalVistorias: number;
  aprovadas: number;
  reprovadas: number;
  taxaAprovacao: number;
  tempoMedio: number;
}

export interface BrandsReportResponse {
  total: number;
  marcas: BrandReportData[];
}

export interface ProblemReportData {
  item: string;
  totalReprovacoes: number;
  percentualReprovacao: number;
  marcasAfetadas: string[];
  exemplos: {
    vistoriaId: string;
    veiculo: string;
    placa: string;
    comentario?: string;
  }[];
}

export interface ProblemsReportResponse {
  total: number;
  problemas: ProblemReportData[];
}
