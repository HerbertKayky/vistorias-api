import { PrismaService } from '../shared/prisma/prisma.service';
import { StatusVistoria } from '../shared/types/status-vistoria.type';
import { ChecklistStatus } from '../shared/types/checklist-status.type';

export class InspectionsSeed {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<void> {
    console.log('🔍 Criando vistorias...');

    // Buscar inspetores
    const inspectors = await this.prisma.user.findMany({
      where: { role: 'INSPECTOR' },
    });

    if (inspectors.length === 0) {
      throw new Error(
        'Nenhum inspetor encontrado. Execute o seed de usuários primeiro.',
      );
    }

    // Buscar veículos
    const vehicles = await this.prisma.vehicle.findMany();

    if (vehicles.length === 0) {
      throw new Error(
        'Nenhum veículo encontrado. Execute o seed de veículos primeiro.',
      );
    }

    // Definir distribuição dos status
    const statusDistribution = [
      { status: StatusVistoria.PENDENTE, count: 4 },
      { status: StatusVistoria.EM_ANDAMENTO, count: 3 },
      { status: StatusVistoria.APROVADA, count: 6 },
      { status: StatusVistoria.REPROVADA, count: 4 },
      { status: StatusVistoria.CANCELADA, count: 3 },
    ];

    const inspections: any[] = [];
    let inspectionIndex = 0;

    // Criar vistorias para cada status
    for (const { status, count } of statusDistribution) {
      for (let i = 0; i < count; i++) {
        const randomInspector =
          inspectors[Math.floor(Math.random() * inspectors.length)];
        const randomVehicle =
          vehicles[Math.floor(Math.random() * vehicles.length)];

        const dataInicio = new Date();
        dataInicio.setDate(
          dataInicio.getDate() - Math.floor(Math.random() * 30),
        ); // Últimos 30 dias

        let dataFim: Date | null = null;
        let tempoGasto: number | null = null;

        // Para vistorias finalizadas, definir data fim e tempo gasto
        if (
          status === StatusVistoria.APROVADA ||
          status === StatusVistoria.REPROVADA
        ) {
          dataFim = new Date(dataInicio);
          dataFim.setMinutes(
            dataFim.getMinutes() + Math.floor(Math.random() * 120) + 30,
          ); // 30-150 minutos
          tempoGasto = Math.floor(
            (dataFim.getTime() - dataInicio.getTime()) / (1000 * 60),
          );
        }

        const inspection = {
          titulo: `Vistoria ${inspectionIndex + 1} - ${randomVehicle.nome}`,
          descricao: `Vistoria de segurança do veículo ${randomVehicle.nome} (${randomVehicle.placa})`,
          status,
          dataInicio,
          dataFim,
          tempoGasto,
          vehicleId: randomVehicle.id,
          inspectorId: randomInspector.id,
          observacoes:
            status === StatusVistoria.REPROVADA
              ? 'Veículo apresentou problemas de segurança que precisam ser corrigidos.'
              : status === StatusVistoria.APROVADA
                ? 'Veículo aprovado em todos os itens de segurança.'
                : null,
        };

        inspections.push(inspection);
        inspectionIndex++;
      }
    }

    // Criar as vistorias no banco
    const createdInspections: any[] = [];
    for (const inspection of inspections) {
      const created = await this.prisma.vistoria.create({
        data: inspection,
      });
      createdInspections.push(created);
    }

    // Criar checklist items para cada vistoria
    const checklistItems = [
      { key: 'freios', name: 'Sistema de Freios' },
      { key: 'pneus', name: 'Pneus e Rodas' },
      { key: 'luzes', name: 'Sistema de Iluminação' },
      { key: 'direcao', name: 'Sistema de Direção' },
      { key: 'motor', name: 'Motor e Transmissão' },
      { key: 'suspensao', name: 'Suspensão' },
      { key: 'escapamento', name: 'Sistema de Escapamento' },
      { key: 'documentos', name: 'Documentação' },
    ];

    for (const inspection of createdInspections) {
      // Para vistorias pendentes, criar apenas alguns itens
      if (inspection.status === StatusVistoria.PENDENTE) {
        const itemsToCreate = checklistItems.slice(
          0,
          Math.floor(Math.random() * 4) + 2,
        );
        for (const item of itemsToCreate) {
          await this.prisma.checklistItem.create({
            data: {
              key: item.key,
              status: ChecklistStatus.NAO_APLICAVEL,
              vistoriaId: inspection.id,
            },
          });
        }
      }
      // Para vistorias em andamento, criar todos os itens como não aplicável
      else if (inspection.status === StatusVistoria.EM_ANDAMENTO) {
        for (const item of checklistItems) {
          await this.prisma.checklistItem.create({
            data: {
              key: item.key,
              status: ChecklistStatus.NAO_APLICAVEL,
              vistoriaId: inspection.id,
            },
          });
        }
      }
      // Para vistorias finalizadas, criar todos os itens com status aleatório
      else if (
        inspection.status === StatusVistoria.APROVADA ||
        inspection.status === StatusVistoria.REPROVADA
      ) {
        for (const item of checklistItems) {
          const status =
            inspection.status === StatusVistoria.APROVADA
              ? ChecklistStatus.APROVADO
              : Math.random() > 0.3
                ? ChecklistStatus.REPROVADO
                : ChecklistStatus.APROVADO;

          await this.prisma.checklistItem.create({
            data: {
              key: item.key,
              status,
              vistoriaId: inspection.id,
              comment:
                status === ChecklistStatus.REPROVADO
                  ? `Problema encontrado no item ${item.name}`
                  : null,
            },
          });
        }
      }
    }

    console.log(
      `✅ ${createdInspections.length} vistorias criadas com sucesso!`,
    );
    console.log(`   - Pendentes: ${statusDistribution[0].count}`);
    console.log(`   - Em Andamento: ${statusDistribution[1].count}`);
    console.log(`   - Aprovadas: ${statusDistribution[2].count}`);
    console.log(`   - Reprovadas: ${statusDistribution[3].count}`);
    console.log(`   - Canceladas: ${statusDistribution[4].count}`);
  }
}
