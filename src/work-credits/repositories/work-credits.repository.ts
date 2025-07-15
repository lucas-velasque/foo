import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkCredit } from '../entities/work-credit.entity';
import { CreateWorkCreditDto } from '../dto/create-work-credit.dto';
import { UpdateWorkCreditDto } from '../dto/update-work-credit.dto';
import { FindOptions, CreationAttributes } from 'sequelize';

@Injectable()
export class WorkCreditsRepository {
  constructor(
    @InjectModel(WorkCredit)
    private readonly workCreditModel: typeof WorkCredit,
  ) {}

  async create(createWorkCreditDto: CreateWorkCreditDto): Promise<WorkCredit> {
    try {
      const result = await this.workCreditModel.create(createWorkCreditDto as any);
      return result;
    } catch (error: any) {
      throw error;
    }
  }

  async findAll(options?: FindOptions<WorkCredit>): Promise<WorkCredit[]> {
    return this.workCreditModel.findAll(options);
  }

  async findByPk(id: string, options?: FindOptions<WorkCredit>): Promise<WorkCredit | null> {
    return this.workCreditModel.findByPk(id, options);
  }

  async update(id: string, updateWorkCreditDto: UpdateWorkCreditDto): Promise<[number, WorkCredit[]]> {
    return this.workCreditModel.update(updateWorkCreditDto, {
      where: { id },
      returning: true,
    });
  }

  async destroy(id: string): Promise<number> {
    return this.workCreditModel.destroy({
      where: { id },
    });
  }
}
