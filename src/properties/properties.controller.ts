import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FilterPropertiesDto } from './dto/filter-properties.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Property } from './entities/property.entity';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN) 
  @Post()
  async create(@Request() req: any, @Body() createPropertyDto: CreatePropertyDto): Promise<Property> {
    return this.propertiesService.create(req.user.id, createPropertyDto);
  }

  @Get()
  async findAll(@Query() filters: FilterPropertiesDto) {
    return this.propertiesService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Property> {
    return this.propertiesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN) 
  @Put(':id')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    return this.propertiesService.update(req.user.id, id, updatePropertyDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN) 
  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string): Promise<{ message: string }> {
    await this.propertiesService.remove(req.user.id, id);
    return { message: `Property with ID ${id} has been successfully deleted.` }; 
  }
}