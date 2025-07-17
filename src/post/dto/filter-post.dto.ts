import { User } from '../../user/entities/user.entity';

export class FilterPostDto {
  page: string;

  items_per_page: string;

  search: string;
}