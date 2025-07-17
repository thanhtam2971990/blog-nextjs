import { User } from '../../user/entities/user.entity';

export class UpdatePostDto {
  title: string;

  description: string;

  thumbnail: string;

  status: number;

}