import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkCredit } from './entities/work-credit.entity';
import { CreateWorkCreditDto } from './dto/create-work-credit.dto';
import { UpdateWorkCreditDto } from './dto/update-work-credit.dto';
import { UsersService } from '../users/users.service';
import { WorkCreditsRepository } from './repositories/work-credits.repository';
import { User } from '../users/entities/user.entity';
import { CreditType } from './enums/credit-type.enum'; 

@Injectable()
export class WorkCreditsService {
  constructor(
    private readonly workCreditsRepository: WorkCreditsRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: string, createWorkCreditDto: CreateWorkCreditDto): Promise<WorkCredit> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    
    const creditData = { 
      ...createWorkCreditDto, 
      user_id: userId,
      date: createWorkCreditDto.date ? new Date(createWorkCreditDto.date) : new Date()
    };
    
    return this.workCreditsRepository.create(creditData as any);
  }

  async findAll(): Promise<WorkCredit[]> {
    return this.workCreditsRepository.findAll({
      include: [{
        model: User, 
        as: 'user',
        attributes: ['id', 'name', 'email'],
      }],
    });
  }

  async findOne(id: string): Promise<WorkCredit> {
    const workCredit = await this.workCreditsRepository.findByPk(id, {
      include: [{
        model: User, 
        as: 'user',
        attributes: ['id', 'name', 'email'],
      }],
    });
    if (!workCredit) {
      throw new NotFoundException(`Crédito de serviço com ID ${id} não encontrado`);
    }
    return workCredit;
  }

  async update(id: string, updateWorkCreditDto: UpdateWorkCreditDto): Promise<WorkCredit> {
    const workCredit = await this.findOne(id);
    const updateData = {
      ...updateWorkCreditDto,
      date: updateWorkCreditDto.date ? new Date(updateWorkCreditDto.date) : workCredit.date,
    };
    await this.workCreditsRepository.update(id, updateData as any);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const workCredit = await this.findOne(id);
    await this.workCreditsRepository.destroy(id);
  }

  async getUserCredits(userId: string): Promise<WorkCredit[]> {
    return this.workCreditsRepository.findAll({ where: { user_id: userId } });
  }

  async calculateTotalCredits(userId: string): Promise<number> {
    const credits = await this.getUserCredits(userId);
    let total = 0;
    credits.forEach(credit => {
      if (credit.type === CreditType.EARNED || credit.type === CreditType.PURCHASED || 
          credit.type === CreditType.ADJUSTMENT_ADD || credit.type === CreditType.TRANSFER_RECEIVED) {
        total += credit.hours;
      } else if (credit.type === CreditType.REDEEMED || credit.type === CreditType.ADJUSTMENT_SUBTRACT || 
                 credit.type === CreditType.EXPIRATION || credit.type === CreditType.TRANSFER_SENT) {
        total -= credit.hours;
      }
    });
    return total;
  }
}