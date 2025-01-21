import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3ConfigFactory {
  static create(config: ConfigService) {
    const useLocalstack =
      config.get('AWS_S3_USE_LOCALSTACK', 'false') === 'true';

    const s3Config = useLocalstack
      ? this.getLocalstackConfig(config)
      : this.getConfig(config);
    return new S3Client(s3Config);
  }

  private static getConfig(config: ConfigService): S3ClientConfig {
    return {
      region: config.get('AWS_REGION'),
      credentials: {
        accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
        sessionToken: config.get('AWS_SESSION_TOKEN'),
      },
    } as S3ClientConfig;
  }

  private static getLocalstackConfig(config: ConfigService): S3ClientConfig {
    const baseConfig = this.getConfig(config);
    return {
      ...baseConfig,
      endpoint: config.getOrThrow<string>('AWS_S3_LOCALSTACK_ENDPOINT'),
      forcePathStyle: true,
    };
  }
}
//aws --endpoint-url=http://localhost:4566 s3api list-objects --bucket=fiap7soat-f5-hacka
//aws --endpoint-url=http://localhost:4566 s3api delete-object --bucket=fiap7soat-f5-hacka --key=6592008029c8c3e4dc76256c/frame_at_140.png
