import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10000)
  @Type(() => Number)
  limit: number = 20;

  @IsOptional()
  @IsString()
  @IsString({ each: true })
  @Matches(/^[a-zA-Z0-9_]+:(asc|desc)$/, {
    each: true,
    message:
      'Invalid sort format. Each entry should be in the format field:asc|desc',
  })
  sort: string;
}

export const parseSortField = (sortField: string, whiteList: string[] = []) => {
  return sortField
    ? sortField.split(',').reduce((acc, sortItem) => {
        const [field, order] = sortItem.split(':');

        if (whiteList && !whiteList.includes(field)) {
          return acc;
        }

        acc[field] = order === 'asc' ? 1 : -1;
        return acc;
      }, {})
    : {};
};
