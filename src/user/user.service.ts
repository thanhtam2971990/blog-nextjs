import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository:Repository<User>) {
  }

  async findAll():Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'first_name', 'last_name', 'email', 'status', 'created_at' , 'updated_at']
    });
  }
}
