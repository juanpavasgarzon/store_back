import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { PaginationRequest } from '../dto/pagination-request';
import { parseQueryString } from '../utils/parse-query-string.util';

@Injectable()
export class ParsePaginationQueryPipe implements PipeTransform<
  Record<string, unknown>,
  PaginationRequest
> {
  transform(value: Record<string, unknown>): PaginationRequest {
    const parsed = parseQueryString(value);
    const instance = plainToInstance(PaginationRequest, parsed);
    const errors = validateSync(instance);
    if (errors.length > 0) {
      const messages = errors.flatMap((e) => Object.values(e.constraints ?? {}));
      throw new BadRequestException(messages.length ? messages : 'Invalid pagination query');
    }
    return instance;
  }
}
