import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { User } from '../users/entities/user.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { UserRole } from '../users/entities/user.entity';
import { Op } from 'sequelize';
import { SocialAssistance } from '../social-assistance/entities/social-assistance.entity'; 
import { SocialAssistanceService } from '../social-assistance/social-assistance.service'; 

interface PropertyWithPending extends Property {
  has_pending_bookings?: boolean;
}

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property)
    private propertyModel: typeof Property,

    @InjectModel(User)
    private userModel: typeof User,

    @InjectModel(Booking)
    private bookingModel: typeof Booking,

    private readonly socialAssistanceService?: SocialAssistanceService, 
  ) {
    console.log('[PROPERTIES SERVICE] Construtor chamado');
    console.log('[PROPERTIES SERVICE] propertyModel injetado:', !!this.propertyModel);
    
    this.testModel();
  }

  private async testModel() {
    try {
      console.log('[PROPERTIES SERVICE] Testando modelo...');
      const count = await this.propertyModel.count();
      console.log('[PROPERTIES SERVICE] Total de propriedades no banco:', count);
    } catch (error: any) {
      console.error('[PROPERTIES SERVICE] Erro ao testar modelo:', error.message);
    }
  }

  async create(ownerId: string, createPropertyDto: CreatePropertyDto): Promise<Property> {
    console.log('[PROPERTIES SERVICE] create chamado com ownerId:', ownerId);
    console.log('[PROPERTIES SERVICE] createPropertyDto:', createPropertyDto);
    
    const owner = await this.userModel.findByPk(ownerId);
    console.log('[PROPERTIES SERVICE] owner encontrado:', owner ? owner.role : 'não encontrado');

    if (!owner) {
      throw new UnauthorizedException('User not found.');
    }

    if (owner.role !== UserRole.SUPPLIER && owner.role !== UserRole.ADMIN) { 
      throw new UnauthorizedException('Only suppliers and admins can create properties.');
    }

    if (createPropertyDto.social_assistance_id && this.socialAssistanceService) {
      const socialAssistanceExists = await this.socialAssistanceService.findById(createPropertyDto.social_assistance_id);
      if (!socialAssistanceExists) {
        throw new NotFoundException(`Social Assistance with ID ${createPropertyDto.social_assistance_id} not found.`);
      }
    }

    return this.propertyModel.create({ ...createPropertyDto, owner_id: ownerId } as any);
  }

  async findAll(filters: { 
    name?: string; 
    location?: string; 
    payment_type?: string;
    availability_period?: string;
    is_active?: boolean;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: 'ASC' | 'DESC';
  } = {}): Promise<{
    data: PropertyWithPending[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    console.log('[PROPERTIES SERVICE] findAll chamado com filtros:', filters);
    
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;
    const sortBy = filters.sort_by || 'created_at';
    const sortOrder = filters.sort_order || 'DESC';

    const whereClause: any = {};
    
    if (filters.name) {
      whereClause.name = { [Op.like]: `%${filters.name}%` };
    }
    if (filters.location) {
      whereClause.location = { [Op.like]: `%${filters.location}%` };
    }
    if (filters.payment_type) {
      whereClause.payment_type = filters.payment_type;
    }
    if (filters.availability_period) {
      whereClause.availability_period = filters.availability_period;
    }
    if (filters.is_active !== undefined) {
      whereClause.is_active = filters.is_active;
    }

    const { count, rows: properties } = await this.propertyModel.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Booking,
          as: 'bookings',
          required: false
        },
        {
          model: SocialAssistance,
          as: 'socialAssistance',
          required: false
        }
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    console.log('[PROPERTIES SERVICE] findAll retornou:', properties.length, 'propriedades de', count, 'total');
    
    const propertiesWithPending = properties.map((property) => {
      const hasPending = property.bookings?.some(
        (booking) => booking.status === 'pending',
      ) || false;
      
      const propertyData = property.toJSON();
      (propertyData as any).has_pending_bookings = hasPending;
      
      return propertyData as PropertyWithPending;
    });

    return {
      data: propertiesWithPending,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findOne(id: string): Promise<PropertyWithPending> {
    console.log('[PROPERTIES SERVICE] findOne chamado com ID:', id);

    const property = await this.propertyModel.findOne({
      where: { id: id }
    });
    
    console.log('[PROPERTIES SERVICE] Resultado do findOne:', property ? 'encontrado' : 'não encontrado');

    if (!property) {
      console.log('[PROPERTIES SERVICE] Propriedade não encontrada, lançando NotFoundException');
      throw new NotFoundException('Property not found');
    }

    const bookings = await this.bookingModel.findAll({
      where: { property_id: id }
    });

    const hasPending = bookings.some(
      (booking) => booking.status === 'pending',
    );

    const propertyData = property.toJSON();
    (propertyData as any).has_pending_bookings = hasPending;
    
    console.log('[PROPERTIES SERVICE] Propriedade retornada com sucesso');
    return propertyData as PropertyWithPending;
  }

  async update(ownerId: string, id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    const property = await this.propertyModel.findByPk(id);
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found.`);
    }

    if (property.owner_id !== ownerId) {
      throw new UnauthorizedException('You are not the owner of this property.');
    }

    if (updatePropertyDto.social_assistance_id && this.socialAssistanceService) {
      const socialAssistanceExists = await this.socialAssistanceService.findById(updatePropertyDto.social_assistance_id);
      if (!socialAssistanceExists) {
        throw new NotFoundException(`Social Assistance with ID ${updatePropertyDto.social_assistance_id} not found.`);
      }
    }

    await this.propertyModel.update(updatePropertyDto, {
      where: { id },
    });

    const updatedProperty = await this.propertyModel.findByPk(id);
    return updatedProperty!;
  }

  async remove(ownerId: string, id: string): Promise<void> {
    const property = await this.propertyModel.findByPk(id);
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found.`);
    }

    if (property.owner_id !== ownerId) {
      throw new UnauthorizedException('You are not authorized to delete this property.');
    }

    await this.propertyModel.destroy({
      where: { id },
    });
  }

  async findBySupplierId(supplierId: string): Promise<Property[]> {
    return this.propertyModel.findAll({ where: { owner_id: supplierId } });
  }
}