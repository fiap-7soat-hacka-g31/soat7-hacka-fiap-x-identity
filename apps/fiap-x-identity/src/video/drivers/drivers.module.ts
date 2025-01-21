import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from '../application/application.module';
import { GetMyVideoController } from './get-my-video.controller';
import { ListMyVideosController } from './list-my-videos.controller';
import { UploadVideoController } from './upload-video.controller';

const HttpDrivers = [
  UploadVideoController,
  GetMyVideoController,
  ListMyVideosController,
];

const AmqpDrivers = [];

@Module({
  imports: [CqrsModule, ApplicationModule],
  providers: [...AmqpDrivers],
  controllers: [...HttpDrivers],
})
export class DriversModule {}
