import { IsArray, IsInt, IsPositive, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationMetaDto {
  @IsInt()
  @Min(0)
  total: number;

  @IsInt()
  @IsPositive()
  page: number;

  @IsInt()
  @IsPositive()
  limit: number;

  @IsInt()
  @Min(0)
  totalPages: number;
}

export class PaginatedOrdersResponseDto {
  @IsArray()
  data: any[];

  @ValidateNested()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;
}
