import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Suggestion } from './entities/suggestion.entity';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { UpdateSuggestionDto } from './dto/update-suggestion.dto';
import { BookingsService } from '../bookings/bookings.service';
import { BookingStatus } from '../bookings/enums/booking-status.enum';
import { Property } from '../properties/entities/property.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SuggestionsService {
  constructor(
    @InjectModel(Suggestion)
    private suggestionModel: typeof Suggestion,
    private bookingsService: BookingsService,
  ) {}

  async create(createSuggestionDto: CreateSuggestionDto, userId: string): Promise<Suggestion> {
    const hasVisited = await this.bookingsService.hasUserVisitedProperty(
      userId,
      createSuggestionDto.propertyId,
    );

    if (!hasVisited) {
      throw new UnauthorizedException(
        'Você só pode enviar sugestões para hotéis que visitou.',
      );
    }

    const suggestion = new this.suggestionModel();
    suggestion.content = createSuggestionDto.content;
    suggestion.user_id = userId;
    suggestion.property_id = createSuggestionDto.propertyId;
    await suggestion.save();

    return suggestion;
  }

  async findAll(): Promise<Suggestion[]> {
    return this.suggestionModel.findAll({
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: Property, attributes: ["id", "name", "location"] },
      ],
    });
  }

  async findOne(id: string): Promise<Suggestion> {
    const suggestion = await this.suggestionModel.findByPk(id, {
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: Property, attributes: ["id", "name", "location"] },
      ],
    });
    if (!suggestion) {
      throw new NotFoundException(`Sugestão com ID ${id} não encontrada.`);
    }
    return suggestion;
  }

  async update(id: string, updateSuggestionDto: UpdateSuggestionDto, userId: string): Promise<Suggestion> {
    const suggestion = await this.findOne(id);

    if (suggestion.user_id !== userId) {
      throw new UnauthorizedException(
        'Você só pode atualizar suas próprias sugestões.',
      );
    }

    await this.suggestionModel.update(updateSuggestionDto, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const suggestion = await this.findOne(id);

    if (suggestion.user_id !== userId) {
      throw new UnauthorizedException(
        'Você só pode remover suas próprias sugestões.',
      );
    }

    await this.suggestionModel.destroy({ where: { id } });
  }
}


