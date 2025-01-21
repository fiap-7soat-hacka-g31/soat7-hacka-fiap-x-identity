import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { FileUploadInput, FileUploadOutput } from './dto';

@Injectable()
export class AwsS3StorageService {
  private readonly provider = 'AWS::S3';

  constructor(private readonly client: S3Client) {}

  async uploadFile({
    bucket,
    path,
    content,
  }: FileUploadInput): Promise<FileUploadOutput> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: path,
      Body: content,
    });
    await this.client.send(command);
    return {
      provider: this.provider,
      bucket,
      path,
    };
  }
}
