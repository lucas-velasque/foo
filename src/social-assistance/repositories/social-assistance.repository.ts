import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SocialAssistance } from '../entities/social-assistance.entity';

@Injectable()
export class SocialAssistanceRepository {
  constructor(
    @InjectModel(SocialAssistance)
    private readonly socialAssistanceModel: typeof SocialAssistance,
  ) {}

  async create(socialAssistance: Partial<SocialAssistance>): Promise<SocialAssistance> {
    console.log('Repository: Creating with data:', socialAssistance);
    try {
      const result = await this.socialAssistanceModel.create(socialAssistance as SocialAssistance);
      console.log('Repository: Created result:', result.toJSON());
      return result;
    } catch (error) {
      console.error('Repository: Error creating social assistance:', error);
      throw error;
    }
  }

  async findAll(): Promise<SocialAssistance[]> {
    console.log('Repository: Finding all social assistances');
    const result = await this.socialAssistanceModel.findAll();
    console.log('Repository: Found social assistances:', result.map(r => r.toJSON()));
    return result;
  }

  async findById(id: string): Promise<SocialAssistance | null> {
    return this.socialAssistanceModel.findByPk(id);
  }

  async findByEmail(email: string): Promise<SocialAssistance | null> {
    return this.socialAssistanceModel.findOne({ where: { contact_email: email } });
  }

  async update(id: string, socialAssistance: Partial<SocialAssistance>): Promise<[number, SocialAssistance[]]> {
    console.log('Repository: Updating with data:', socialAssistance);
    const result = await this.socialAssistanceModel.update(socialAssistance, { where: { id } });
    console.log('Repository: Update result:', result);
    
    // Buscar o registro atualizado
    const updatedRecord = await this.socialAssistanceModel.findByPk(id);
    return [result[0], updatedRecord ? [updatedRecord] : []];
  }

  async remove(id: string): Promise<number> {
    return this.socialAssistanceModel.destroy({ where: { id } });
  }
}