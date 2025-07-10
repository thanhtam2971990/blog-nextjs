import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {FilterUserDto} from "./dto/filter-user.dto";

@Controller('users')
export class UserController {

  constructor(private userService: UserService) {
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query:FilterUserDto): Promise<User[]> {
    console.log("query", query);
    return this.userService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findOne(Number(id));
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createUserDto:CreateUserDto):Promise<User> {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id:string, @Body() updateUserDto:UpdateUserDto):Promise<UpdateResult> {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id:number) {
    return this.userService.delete(id);
  }

}
