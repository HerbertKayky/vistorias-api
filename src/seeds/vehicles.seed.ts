import { PrismaService } from '../shared/prisma/prisma.service';

export class VehiclesSeed {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<void> {
    console.log('🚗 Criando veículos...');

    const vehicles = [
      {
        nome: 'Civic 2020',
        placa: 'ABC-1234',
        marca: 'Honda',
        modelo: 'Civic',
        ano: 2020,
        proprietario: 'João da Silva',
      },
      {
        nome: 'Corolla 2019',
        placa: 'DEF-5678',
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2019,
        proprietario: 'Maria Santos',
      },
      {
        nome: 'Golf 2021',
        placa: 'GHI-9012',
        marca: 'Volkswagen',
        modelo: 'Golf',
        ano: 2021,
        proprietario: 'Pedro Oliveira',
      },
      {
        nome: 'Focus 2018',
        placa: 'JKL-3456',
        marca: 'Ford',
        modelo: 'Focus',
        ano: 2018,
        proprietario: 'Ana Costa',
      },
      {
        nome: 'Cruze 2020',
        placa: 'MNO-7890',
        marca: 'Chevrolet',
        modelo: 'Cruze',
        ano: 2020,
        proprietario: 'Carlos Ferreira',
      },
      {
        nome: 'Sentra 2019',
        placa: 'PQR-1234',
        marca: 'Nissan',
        modelo: 'Sentra',
        ano: 2019,
        proprietario: 'Lucia Mendes',
      },
      {
        nome: 'Elantra 2021',
        placa: 'STU-5678',
        marca: 'Hyundai',
        modelo: 'Elantra',
        ano: 2021,
        proprietario: 'Roberto Alves',
      },
      {
        nome: 'Jetta 2018',
        placa: 'VWX-9012',
        marca: 'Volkswagen',
        modelo: 'Jetta',
        ano: 2018,
        proprietario: 'Fernanda Lima',
      },
      {
        nome: 'Cobalt 2019',
        placa: 'YZA-3456',
        marca: 'Chevrolet',
        modelo: 'Cobalt',
        ano: 2019,
        proprietario: 'Marcos Souza',
      },
      {
        nome: 'Versa 2020',
        placa: 'BCD-7890',
        marca: 'Nissan',
        modelo: 'Versa',
        ano: 2020,
        proprietario: 'Patricia Rocha',
      },
    ];

    const createdVehicles: any[] = [];

    for (const vehicle of vehicles) {
      const created = await this.prisma.vehicle.upsert({
        where: { placa: vehicle.placa },
        update: {},
        create: vehicle,
      });
      createdVehicles.push(created);
    }

    console.log(`✅ ${createdVehicles.length} veículos criados com sucesso!`);
  }
}
