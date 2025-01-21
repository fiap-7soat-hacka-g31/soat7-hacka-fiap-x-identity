import { Transactional } from '@fiap-x/tactical-design/core';
import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Video } from '../../domain/entities/video.aggregate';
import { VideoStatus } from '../../domain/values/video-status.value';
import { StorageService } from '../abstractions/storage.service';
import { VideoRepository } from '../abstractions/video.repository';
import { UploadVideoCommand, UploadVideoResult } from './upload-video.command';

@CommandHandler(UploadVideoCommand)
export class UploadVideoHandler
  implements ICommandHandler<UploadVideoCommand, UploadVideoResult>
{
  constructor(
    private readonly repository: VideoRepository,
    private readonly storage: StorageService,
  ) {}

  @Transactional()
  async execute(command: UploadVideoCommand): Promise<UploadVideoResult> {
    const { data } = command;
    const exists = await this.repository.findByOwnerAndFilename(
      data.ownerId,
      data.filename,
    );
    if (exists) {
      throw new ConflictException('Video already exists');
    }
    const video = new Video(
      this.repository.newId(),
      data.filename,
      data.ownerId,
      VideoStatus.new(),
      data.snapshotIntervalInSeconds,
    );
    const { provider, bucket, path } = await this.storage.uploadVideoForUser(
      `${data.ownerId}/${data.filename}`,
      data.content,
    );
    video.upload(provider, bucket, path);
    await this.repository.create(video);
    await video.commit();
    return new UploadVideoResult({ id: video.id });
  }
}
