import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { SocialAssistanceService } from './social-assistance.service';
import { CreateSocialAssistanceDto } from './dto/create-social-assistance.dto';
import { UpdateSocialAssistanceDto } from './dto/update-social-assistance.dto';

@Controller('social-assistances')
export class SocialAssistanceController {
  constructor(private readonly socialAssistanceService: SocialAssistanceService) {}

  @Post()
  async create(@Body() createSocialAssistanceDto: CreateSocialAssistanceDto) {
    console.log('Controller: Creating social assistance with data:', createSocialAssistanceDto);
    try {
      const result = await this.socialAssistanceService.create(createSocialAssistanceDto);
      console.log('Controller: Created social assistance:', result);
      return result;
    } catch (error) {
      console.error('Controller: Error creating social assistance:', error);
      throw error;
    }
  }

  @Get()
  findAll() {
    console.log('Controller: Getting all social assistances');
    return this.socialAssistanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('Controller: Getting social assistance with ID:', id);
    return this.socialAssistanceService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSocialAssistanceDto: UpdateSocialAssistanceDto) {
    console.log('Controller: Updating social assistance with ID:', id, 'and data:', updateSocialAssistanceDto);
    return this.socialAssistanceService.update(id, updateSocialAssistanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log('Controller: Deleting social assistance with ID:', id);
    return this.socialAssistanceService.remove(id);
  }
}