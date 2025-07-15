import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateSocialAssistanceDto } from './dto/create-social-assistance.dto';
import { UpdateSocialAssistanceDto } from './dto/update-social-assistance.dto';
import { SocialAssistanceRepository } from './repositories/social-assistance.repository';
import { SocialAssistance } from './entities/social-assistance.entity';

@Injectable()
export class SocialAssistanceService {
  constructor(private readonly socialAssistanceRepository: SocialAssistanceRepository) {}

  async create(createSocialAssistanceDto: CreateSocialAssistanceDto): Promise<SocialAssistance> {
    console.log('Service: Creating social assistance with data:', createSocialAssistanceDto);
    
    try {
      const existingOng = await this.socialAssistanceRepository.findByEmail(createSocialAssistanceDto.contact_email);
      if (existingOng) {
        throw new ConflictException(`ONG com o e-mail ${createSocialAssistanceDto.contact_email} já existe.`);
      }
      
      const createdOng = await this.socialAssistanceRepository.create(createSocialAssistanceDto);
      console.log('Service: Created ONG:', createdOng);
      
      return createdOng;
    } catch (error) {
      console.error('Service: Error creating social assistance:', error);
      throw error;
    }
  }

  async findAll(): Promise<SocialAssistance[]> {
    console.log('Service: Finding all social assistances');
    const result = await this.socialAssistanceRepository.findAll();
    console.log('Service: Found social assistances:', result);
    return result;
  }

  async findById(id: string): Promise<SocialAssistance> {
    const ong = await this.socialAssistanceRepository.findById(id);
    if (!ong) {
      throw new NotFoundException(`ONG com ID ${id} não encontrada.`);
    }
    return ong;
  }

  async update(id: string, updateSocialAssistanceDto: UpdateSocialAssistanceDto): Promise<SocialAssistance> {
    console.log('Service: Updating ONG with ID:', id, 'and data:', updateSocialAssistanceDto);
    
    const existingOng = await this.socialAssistanceRepository.findById(id);
    if (!existingOng) {
      throw new NotFoundException(`ONG com ID ${id} não encontrada.`);
    }
    
    const [affectedRows, updatedOngs] = await this.socialAssistanceRepository.update(id, updateSocialAssistanceDto);
    console.log('Service: Update result - affectedRows:', affectedRows, 'updatedOngs:', updatedOngs);
    
    if (affectedRows === 0) {
      throw new Error(`Não foi possível atualizar a ONG com ID ${id}.`);
    }
    
    // Se o Sequelize não retornar os dados atualizados, buscar novamente
    if (!updatedOngs || updatedOngs.length === 0) {
      const updatedOng = await this.socialAssistanceRepository.findById(id);
      if (!updatedOng) {
        throw new Error(`Não foi possível recuperar a ONG atualizada com ID ${id}.`);
      }
      return updatedOng;
    }
    
    return updatedOngs[0];
  }

  async remove(id: string): Promise<void> {
    const ong = await this.socialAssistanceRepository.findById(id);
    if (!ong) {
      throw new NotFoundException(`ONG com ID ${id} não encontrada.`);
    }
    await this.socialAssistanceRepository.remove(id);
  }
}