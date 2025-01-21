import { ObjectIdValidationPipe } from '@fiap-x/tactical-design/mongoose';
import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetMyVideoQuery } from '../application/query/get-my-video.query';

@Controller({ version: '1', path: 'me/videos' })
export class GetMyVideoController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':id')
  async execute(@Param('id', new ObjectIdValidationPipe()) id: string) {
    const ownerId = '6592008029c8c3e4dc76256c';
    const result = await this.queryBus.execute(
      new GetMyVideoQuery({ id, ownerId }),
    );
    return result.data;
  }
}
