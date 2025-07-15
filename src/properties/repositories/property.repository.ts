import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Property } from '../entities/property.entity';
import { CreatePropertyDto } from '../dto/create-property.dto';
import { UpdatePropertyDto } from '../dto/update-property.dto';
import { FindOptions, CreationAttributes } from 'sequelize';

@Injectable()
export class PropertyRepository {
  constructor(
    @InjectModel(Property)
    private readonly propertyModel: typeof Property,
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    
    return this.propertyModel.create(createPropertyDto as CreationAttributes<Property>);
  }

  async findAll(options: FindOptions<Property>): Promise<Property[]> {
    return this.propertyModel.findAll(options);
  }

  async findByPk(id: string, options?: FindOptions<Property>): Promise<Property | null> {
    return this.propertyModel.findByPk(id, options);
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<[number, Property[]]> {
    return this.propertyModel.update(updatePropertyDto, {
      where: { id },
      returning: true,
    });
  }

  async destroy(id: string): Promise<number> {
    return this.propertyModel.destroy({
      where: { id },
    });
  }
}
