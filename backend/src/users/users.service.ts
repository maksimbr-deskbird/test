import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const user = this.usersRepository.create(registerDto);
    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async findOne(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt', 'updatedAt'],
    });
  }
} 