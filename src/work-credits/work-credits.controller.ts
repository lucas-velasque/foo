// src/modules/work-credits/work-credits.controller.ts
import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { WorkCreditsService } from './work-credits.service';
import { CreateWorkCreditDto } from './dto/create-work-credit.dto';
import { UpdateWorkCreditDto } from './dto/update-work-credit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('work-credits')
@UseGuards(JwtAuthGuard)
export class WorkCreditsController {
  constructor(private readonly workCreditsService: WorkCreditsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Request() req: any, @Body() createWorkCreditDto: CreateWorkCreditDto) {
    // Se o usuário é admin, pode usar o user_id do DTO, senão usa o próprio ID
    const userId = req.user.role === UserRole.ADMIN ? createWorkCreditDto.user_id : req.user.id;
    return this.workCreditsService.create(userId, createWorkCreditDto);
  }

  @Get()
  async findAll() {
    return this.workCreditsService.findAll();
  }

  @Get('user')
  async getUserCredits(@Request() req: any) {
    return this.workCreditsService.getUserCredits(req.user.id);
  }

  @Get('user/total')
  async calculateTotalCredits(@Request() req: any) {
    return this.workCreditsService.calculateTotalCredits(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.workCreditsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateWorkCreditDto: UpdateWorkCreditDto) {
    return this.workCreditsService.update(id, updateWorkCreditDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.workCreditsService.remove(id);
  }
}
