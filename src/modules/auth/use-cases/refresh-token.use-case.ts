import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthTokens, JwtPayload } from '../../../shared/interfaces/auth.interface';
import { Role } from '../../../shared/types/role.type';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(refreshTokenDto: RefreshTokenDto): Promise<AuthTokens> {
    const { refreshToken } = refreshTokenDto;

    try {
      // Verificar e decodificar o refresh token
      const payload = this.jwtService.verify(refreshToken) as JwtPayload;

      // Verificar se o usuário ainda existe
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      // Gerar novos tokens
      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role as Role,
      };

      const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });
      const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }
}
