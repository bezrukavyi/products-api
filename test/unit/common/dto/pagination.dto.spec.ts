import { validate } from 'class-validator';
import { PaginationDto, parseSortField } from 'src/common/dto/pagination.dto';

describe('PaginationDto', () => {
  it('should pass validation with default values', async () => {
    const dto = new PaginationDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate page and limit with minimum constraints', async () => {
    const dto = new PaginationDto();
    dto.page = 0;
    dto.limit = 0;

    const errors = await validate(dto);
    expect(errors.length).toBe(2);
    expect(errors[0].property).toBe('page');
    expect(errors[0].constraints?.min).toBeDefined();
    expect(errors[1].property).toBe('limit');
    expect(errors[1].constraints?.min).toBeDefined();
  });

  it('should validate limit with maximum constraint', async () => {
    const dto = new PaginationDto();
    dto.limit = 10001;

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('limit');
    expect(errors[0].constraints?.max).toBeDefined();
  });

  it('should validate sort with correct format', async () => {
    const dto = new PaginationDto();
    dto.sort = 'name:asc';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should invalidate sort with incorrect format', async () => {
    const dto = new PaginationDto();
    dto.sort = 'invalidSortFormat';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('sort');
    expect(errors[0].constraints?.matches).toBeDefined();
  });
});

describe('parseSortField', () => {
  const whiteList = ['name', 'price'];

  it('should parse a valid sort field', () => {
    const result = parseSortField('name:asc', whiteList);
    expect(result).toEqual({ name: 1 });
  });

  it('should parse multiple valid sort fields', () => {
    const result = parseSortField('name:asc,price:desc', whiteList);
    expect(result).toEqual({ name: 1, price: -1 });
  });

  it('should ignore fields not in the whitelist', () => {
    const result = parseSortField('name:asc,quantity:desc', whiteList);
    expect(result).toEqual({ name: 1 });
  });

  it('should return an empty object if no valid sort fields are provided', () => {
    const result = parseSortField('quantity:asc', whiteList);
    expect(result).toEqual({});
  });

  it('should return an empty object if sortField is undefined or empty', () => {
    expect(parseSortField('', whiteList)).toEqual({});
    expect(parseSortField(undefined, whiteList)).toEqual({});
  });
});
