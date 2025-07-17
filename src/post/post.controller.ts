import {
  BadRequestException,
  Body,
  Controller, Delete, Get, Param,
  Post, Put, Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from '../../helpers/config';
import { AuthGuard } from '../auth/auth.guard';
import { FileFilterCallback } from 'multer';
import { extname } from 'path';
import { PostService } from './post.service';
import { FilterPostDto } from './dto/filter-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { DeleteResult } from 'typeorm';

@Controller('posts')
export class PostController {
  constructor(private  postService: PostService) {
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: storageConfig('posts'),
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
  create(@Req() req: any, @Body() createPostDto: CreatePostDto, @UploadedFile() file: Express.Multer.File) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }

    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.postService.create(req['user_data'].id, {...createPostDto, thumbnail:file.path});
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query:FilterPostDto): Promise<any> {
    return this.postService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findDetail(@Param('id') id:string): Promise<PostEntity|null> {
    return this.postService.findDetail(Number(id));
  }

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: storageConfig('posts'),
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
  update(@Param('id') id:string, @Req() req:any, @Body() updatePostDto:UpdatePostDto, @UploadedFile() file: Express.Multer.File) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }

    if (file) {
     updatePostDto.thumbnail = file.path;
    }

    return this.postService.update(Number(id), updatePostDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id:string): Promise<DeleteResult> {
    return this.postService.delete(Number(id));
  }
}
