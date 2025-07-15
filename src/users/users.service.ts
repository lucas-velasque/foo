import { Injectable,Inject,  NotFoundException, forwardRef, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectModel(User)
    public readonly userModel: typeof User,  // <-- Adicionado aqui
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUserByEmail = await this.userRepository.findByEmail(createUserDto.email);
    const existingUserByCpf = await this.userRepository.findByCpf(createUserDto.cpf);
    if (existingUserByEmail) {
      throw new ConflictException(`Usuário com o e-mail ${createUserDto.email} já existe`);
    }
    if (existingUserByCpf) {
      throw new ConflictException(`Usuário com o CPF ${createUserDto.cpf} já existe`);
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.userRepository.create({ ...createUserDto, password: hashedPassword });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findByPk(id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByCpf(cpf: string): Promise<User | null> {
    return this.userRepository.findByCpf(cpf);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    const hashedPassword = updateUserDto.password ? await bcrypt.hash(updateUserDto.password, 10) : undefined;
    await this.userRepository.update(id, { ...updateUserDto, password: hashedPassword });
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.destroy(id);
  }
}
