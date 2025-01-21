import { AwsS3StorageService } from '@fiap-x/storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  StorageService,
  UploadVideoResult,
} from '../../../../application/abstractions/storage.service';

@Injectable()
export class AwsS3VideoStorageService implements StorageService {
  constructor(
    private readonly client: AwsS3StorageService,
    private readonly config: ConfigService,
  ) {}

  async uploadVideoForUser(
    path: string,
    content: Buffer<ArrayBufferLike>,
  ): Promise<UploadVideoResult> {
    const bucket = this.config.get('AWS_S3_BUCKET_NAME');
    return this.client.uploadFile({
      bucket,
      path,
      content,
    });
  }
}
