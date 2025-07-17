import { User } from '../../user/entities/user.entity';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  thumbnail: string;

  status: number;

  user: User
}