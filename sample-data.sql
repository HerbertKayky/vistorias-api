-- Exemplos de dados para testar o sistema completo
-- Execute estes comandos SQL após criar as tabelas com Prisma

-- Inserir inspetores de exemplo
INSERT INTO users (id, name, email, password, role, "createdAt", "updatedAt") VALUES
('inspector1', 'João Silva', 'joao.inspector@email.com', '$2b$10$hash', 'INSPECTOR', NOW(), NOW()),
('inspector2', 'Maria Santos', 'maria.inspector@email.com', '$2b$10$hash', 'INSPECTOR', NOW(), NOW()),
('inspector3', 'Pedro Costa', 'pedro.inspector@email.com', '$2b$10$hash', 'INSPECTOR', NOW(), NOW()),
('admin1', 'Admin Sistema', 'admin@email.com', '$2b$10$hash', 'ADMIN', NOW(), NOW());

-- Inserir veículos de exemplo
INSERT INTO vehicles (id, nome, placa, marca, modelo, ano, proprietario, "createdAt", "updatedAt") VALUES
('veh1', 'Civic Branco', 'ABC-1234', 'Honda', 'Civic', 2020, 'João Proprietário', NOW(), NOW()),
('veh2', 'Corolla Prata', 'DEF-5678', 'Toyota', 'Corolla', 2019, 'Maria Proprietária', NOW(), NOW()),
('veh3', 'Golf Azul', 'GHI-9012', 'Volkswagen', 'Golf', 2021, 'Pedro Proprietário', NOW(), NOW()),
('veh4', 'Focus Vermelho', 'JKL-3456', 'Ford', 'Focus', 2018, 'Ana Proprietária', NOW(), NOW()),
('veh5', 'Cruze Preto', 'MNO-7890', 'Chevrolet', 'Cruze', 2022, 'Carlos Proprietário', NOW(), NOW());

-- Inserir vistorias de exemplo
INSERT INTO vistorias (id, titulo, descricao, status, "dataInicio", "dataFim", "tempoGasto", observacoes, "inspectorId", "vehicleId", "createdAt", "updatedAt") VALUES
-- Vistorias do João Silva
('vist1', 'Vistoria Honda Civic', 'Vistoria completa do Honda Civic', 'APROVADA', '2025-01-20 09:00:00', '2025-01-20 11:30:00', 150, 'Veículo aprovado sem problemas', 'inspector1', 'veh1', NOW(), NOW()),
('vist2', 'Vistoria Toyota Corolla', 'Vistoria completa do Toyota Corolla', 'REPROVADA', '2025-01-21 14:00:00', '2025-01-21 16:45:00', 165, 'Problemas encontrados no sistema de freios', 'inspector1', 'veh2', NOW(), NOW()),
('vist3', 'Vistoria VW Golf', 'Vistoria completa do VW Golf', 'APROVADA', '2025-01-22 10:00:00', '2025-01-22 12:15:00', 135, 'Veículo aprovado', 'inspector1', 'veh3', NOW(), NOW()),

-- Vistorias da Maria Santos
('vist4', 'Vistoria Ford Focus', 'Vistoria completa do Ford Focus', 'APROVADA', '2025-01-20 08:30:00', '2025-01-20 10:45:00', 135, 'Veículo aprovado', 'inspector2', 'veh4', NOW(), NOW()),
('vist5', 'Vistoria Chevrolet Cruze', 'Vistoria completa do Chevrolet Cruze', 'APROVADA', '2025-01-21 13:30:00', '2025-01-21 15:20:00', 110, 'Veículo aprovado', 'inspector2', 'veh5', NOW(), NOW()),
('vist6', 'Vistoria Honda Civic - Segunda', 'Vistoria de revisão do Honda Civic', 'PENDENTE', '2025-01-23 09:00:00', NULL, NULL, 'Vistoria em andamento', 'inspector2', 'veh1', NOW(), NOW()),

-- Vistorias do Pedro Costa
('vist7', 'Vistoria Toyota Corolla - Segunda', 'Vistoria de revisão do Toyota Corolla', 'REPROVADA', '2025-01-19 11:00:00', '2025-01-19 13:30:00', 150, 'Problemas no sistema elétrico', 'inspector3', 'veh2', NOW(), NOW()),
('vist8', 'Vistoria VW Golf - Segunda', 'Vistoria de revisão do VW Golf', 'APROVADA', '2025-01-22 15:00:00', '2025-01-22 17:10:00', 130, 'Veículo aprovado', 'inspector3', 'veh3', NOW(), NOW()),
('vist9', 'Vistoria Ford Focus - Segunda', 'Vistoria de revisão do Ford Focus', 'EM_ANDAMENTO', '2025-01-24 10:00:00', NULL, NULL, 'Vistoria em andamento', 'inspector3', 'veh4', NOW(), NOW()),
('vist10', 'Vistoria Chevrolet Cruze - Segunda', 'Vistoria de revisão do Chevrolet Cruze', 'CANCELADA', '2025-01-23 14:00:00', NULL, NULL, 'Vistoria cancelada pelo cliente', 'inspector3', 'veh5', NOW(), NOW());

-- Inserir itens de checklist de exemplo
INSERT INTO checklist_items (id, key, status, comment, "vistoriaId", "createdAt", "updatedAt") VALUES
-- Checklist da vistoria 1 (Honda Civic - Aprovada)
('item1', 'FREIOS', 'APROVADO', 'Sistema de freios funcionando perfeitamente', 'vist1', NOW(), NOW()),
('item2', 'MOTOR', 'APROVADO', 'Motor em bom estado', 'vist1', NOW(), NOW()),
('item3', 'PNEUS', 'APROVADO', 'Pneus com boa aderência', 'vist1', NOW(), NOW()),
('item4', 'LUZES', 'APROVADO', 'Todas as luzes funcionando', 'vist1', NOW(), NOW()),

-- Checklist da vistoria 2 (Toyota Corolla - Reprovada)
('item5', 'FREIOS', 'REPROVADO', 'Pastilhas de freio desgastadas', 'vist2', NOW(), NOW()),
('item6', 'MOTOR', 'APROVADO', 'Motor em bom estado', 'vist2', NOW(), NOW()),
('item7', 'PNEUS', 'APROVADO', 'Pneus em bom estado', 'vist2', NOW(), NOW()),
('item8', 'LUZES', 'REPROVADO', 'Farol direito com problema', 'vist2', NOW(), NOW()),

-- Checklist da vistoria 3 (VW Golf - Aprovada)
('item9', 'FREIOS', 'APROVADO', 'Sistema de freios OK', 'vist3', NOW(), NOW()),
('item10', 'MOTOR', 'APROVADO', 'Motor funcionando bem', 'vist3', NOW(), NOW()),
('item11', 'PNEUS', 'APROVADO', 'Pneus em bom estado', 'vist3', NOW(), NOW()),
('item12', 'LUZES', 'APROVADO', 'Luzes funcionando', 'vist3', NOW(), NOW());
