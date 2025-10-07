import { IsArray, IsInt, IsPositive, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Total number of orders in the database',
    example: 100,
    minimum: 0
  })
  @IsInt()
  @Min(0)
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
    minimum: 1
  })
  @IsInt()
  @IsPositive()
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1
  })
  @IsInt()
  @IsPositive()
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
    minimum: 0
  })
  @IsInt()
  @Min(0)
  totalPages: number;
}

export class PaginatedOrdersResponseDto {
  @ApiProperty({
    description: 'Array of order objects',
    type: 'array',
    items: {
      type: 'object'
    }
  })
  @IsArray()
  data: any[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto
  })
  @ValidateNested()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;
}
