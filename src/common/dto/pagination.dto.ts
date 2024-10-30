import { IsInt, IsOptional, IsString, Min, Max, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Custom type for sort direction
type SortOrder = 'asc' | 'desc';

export class PaginationDto {
  @ApiProperty({ example: 1, description: 'Page number', minimum: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({
    example: 20,
    description: 'Number of items per page',
    minimum: 1,
    maximum: 10000,
  })
  @IsInt()
  @Min(1)
  @Max(10000)
  @Type(() => Number)
  limit: number = 20;

  @ApiProperty({
    example: 'name:asc',
    description: 'Sort field and order (e.g., field:asc or field:desc)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+:(asc|desc)$/, {
    message: 'Sort format should be "field:asc" or "field:desc"',
  })
  sort?: string;
}

// Utility function to parse sort field and order
export const parseSortField = (sortField: string, whiteList: string[] = []) => {
  return sortField
    ? sortField.split(',').reduce(
        (acc, sortItem) => {
          const [field, order] = sortItem.split(':');
          if (!whiteList.includes(field)) {
            return acc;
          }
          acc[field] = order === 'asc' ? 1 : -1;
          return acc;
        },
        {} as Record<string, 1 | -1>,
      )
    : {};
};
