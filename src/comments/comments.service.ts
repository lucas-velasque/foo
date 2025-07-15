import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment)
    private commentModel: typeof Comment,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
    const comment = await this.commentModel.create({
      ...createCommentDto,
      userId,
    });

    return this.findOne(comment.id);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentModel.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentModel.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!comment) {
      throw new NotFoundException(`Comentário com ID ${id} não encontrado`);
    }

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<Comment> {
    const comment = await this.findOne(id);

    if (comment.userId !== userId) {
      throw new ForbiddenException('Você só pode editar seus próprios comentários');
    }

    await comment.update(updateCommentDto);
    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.findOne(id);

    if (comment.userId !== userId) {
      throw new ForbiddenException('Você só pode deletar seus próprios comentários');
    }

    await comment.destroy();
  }
}

