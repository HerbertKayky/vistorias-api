import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
// Tipo local para evitar problemas de import
type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RegisterUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<Omit<User, 'password'>> {
    const { name, email, password, role = 'ADMIN' } = data;

    // Verificar se o usuário já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Usuário já existe com este email');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as any,
      },
    });

    // Retornar usuário sem a senha
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
