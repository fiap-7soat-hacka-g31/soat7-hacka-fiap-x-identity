import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InfraModule } from '../infra/infra.module';
import { UploadVideoHandler } from './commands/upload-video.handler';
import { GetMyVideoHandler } from './query/get-my-video.handler';
import { ListMyVideosHandler } from './query/list-my-videos.handler';

const QueryHandlers = [];
const CommandHandlers = [
  UploadVideoHandler,
  GetMyVideoHandler,
  ListMyVideosHandler,
];

@Module({
  imports: [CqrsModule, InfraModule],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class ApplicationModule {}
