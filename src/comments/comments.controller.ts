import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar um novo comentário' })
  @ApiResponse({ status: 201, description: 'Comentário criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  create(
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
    @Request() req: any,
  ) {
    return this.commentsService.create(createCommentDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os comentários' })
  @ApiResponse({ status: 200, description: 'Lista de comentários retornada com sucesso.' })
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um comentário por ID' })
  @ApiResponse({ status: 200, description: 'Comentário encontrado.' })
  @ApiResponse({ status: 404, description: 'Comentário não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar um comentário' })
  @ApiResponse({ status: 200, description: 'Comentário atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Proibido - você só pode editar seus próprios comentários.' })
  @ApiResponse({ status: 404, description: 'Comentário não encontrado.' })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCommentDto: UpdateCommentDto,
    @Request() req: any,
  ) {
    return this.commentsService.update(id, updateCommentDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar um comentário' })
  @ApiResponse({ status: 200, description: 'Comentário deletado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Proibido - você só pode deletar seus próprios comentários.' })
  @ApiResponse({ status: 404, description: 'Comentário não encontrado.' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.commentsService.remove(id, req.user.id);
  }
}

