import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UpdateResult } from 'typeorm';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {storageConfig} from "../../helpers/config";
import { extname } from 'path';
import {FileFilterCallback} from "multer";

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: FilterUserDto): Promise<User[]> {
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
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }

  @Post('upload-avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(
      FileInterceptor('avatar', {
        storage: storageConfig('avatar'),
        limits: {
          fileSize: 5 * 1024 * 1024,
        },
        fileFilter: (
            req: Request & { fileValidationError?: string },
            file: Express.Multer.File,
            cb: FileFilterCallback,
        ) => {
          const ext = extname(file.originalname).toLowerCase().replace('.', '');
          const allowedExtArr = ['jpg', 'jpeg', 'png'];

          if (!allowedExtArr.includes(ext)) {
            (req as any).fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.join(', ')}`;
            return cb(null, false);
          }

          cb(null, true);
        },
      }),
  )
  async updateAvatar(
      @Req() req: any,
      @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }

    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.userService.updateAvatar(req.user_data.id, file.path);
  }
}
