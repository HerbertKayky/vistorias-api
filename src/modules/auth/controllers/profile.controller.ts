import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import type { UserPayload } from '../../../shared/interfaces/auth.interface';
import { Role } from '../../../shared/types/role.type';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  @Get()
  getProfile(@CurrentUser() user: UserPayload) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  getAdminProfile(@CurrentUser() user: UserPayload) {
    return {
      message: 'Acesso autorizado para administradores',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Get('inspector')
  @UseGuards(RolesGuard)
  @Roles(Role.INSPECTOR, Role.ADMIN)
  getInspectorProfile(@CurrentUser() user: UserPayload) {
    return {
      message: 'Acesso autorizado para inspetores e administradores',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
