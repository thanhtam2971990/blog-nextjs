import { ApiProperty } from '@nestjs/swagger';

export class FilterUserDto {
  @ApiProperty({ default: 1 })
  page: string;
  @ApiProperty({ default: 10 })
  items_per_page: string;
  @ApiProperty({ default: '', required: false })
  search: string;
}
