import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { UpdateSuggestionDto } from './dto/update-suggestion.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('suggestions')
@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma nova sugestão de melhoria' })
  @ApiResponse({ status: 201, description: 'Sugestão criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async create(
    @Body(ValidationPipe) createSuggestionDto: CreateSuggestionDto,
    @Request() req: any,
  ) {
    return this.suggestionsService.create(createSuggestionDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as sugestões de melhoria' })
  @ApiResponse({ status: 200, description: 'Lista de sugestões.' })
  async findAll() {
    return this.suggestionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma sugestão de melhoria por ID' })
  @ApiResponse({ status: 200, description: 'Sugestão encontrada.' })
  @ApiResponse({ status: 404, description: 'Sugestão não encontrada.' })
  async findOne(@Param('id') id: string) {
    return this.suggestionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar uma sugestão de melhoria' })
  @ApiResponse({ status: 200, description: 'Sugestão atualizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Proibido (apenas o autor pode atualizar).' })
  @ApiResponse({ status: 404, description: 'Sugestão não encontrada.' })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateSuggestionDto: UpdateSuggestionDto,
    @Request() req: any,
  ) {
    return this.suggestionsService.update(id, updateSuggestionDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover uma sugestão de melhoria' })
  @ApiResponse({ status: 204, description: 'Sugestão removida com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Proibido (apenas o autor pode remover).' })
  @ApiResponse({ status: 404, description: 'Sugestão não encontrada.' })
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.suggestionsService.remove(id, req.user.id);
  }
}


