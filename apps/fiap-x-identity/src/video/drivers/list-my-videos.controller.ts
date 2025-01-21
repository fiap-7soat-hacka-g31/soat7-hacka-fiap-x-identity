import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ListMyVideosQuery } from '../application/query/list-my-videos.query';

@Controller({ version: '1', path: 'me/videos' })
export class ListMyVideosController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async execute() {
    const ownerId = '6592008029c8c3e4dc76256c';
    const result = await this.queryBus.execute(
      new ListMyVideosQuery({ ownerId }),
    );
    return result;
  }
}
