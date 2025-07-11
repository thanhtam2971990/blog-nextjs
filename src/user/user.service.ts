import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {DeleteResult, Like, Repository, UpdateResult} from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import {FilterUserDto} from "./dto/filter-user.dto";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
  }

  async findAll(query: FilterUserDto): Promise<any> {
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * items_per_page;
    const search = query.search?.trim();
    const where = search
        ? [
          { first_name: Like(`%${search}%`) },
          { last_name: Like(`%${search}%`) },
          { email: Like(`%${search}%`) },
        ]
        : {};
    const [res, total] = await this.userRepository.findAndCount({
      where,
      order: {created_at: 'DESC'},
      take: items_per_page,
      skip: skip,
      select: ['id', 'first_name', 'last_name', 'email', 'status', 'created_at', 'updated_at'],
    });
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: res,
      total,
      currentPage: page,
      nextPage,
      prevPage,
      lastPage
    }
  }

  async findOne(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    return await this.userRepository.save({
      ...createUserDto,
      password: hashPassword,
    });
  }

  async update(id, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return await this.userRepository.update(id, updateUserDto);
  }

  async delete(id: number):Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
