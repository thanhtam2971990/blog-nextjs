import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from './user.service';

@Controller('users')
export class UserController {

  constructor(private userService: UserService) {
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

}
