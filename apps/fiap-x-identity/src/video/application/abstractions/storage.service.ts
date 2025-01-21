export type UploadVideoResult = {
  provider: string;
  bucket: string;
  path: string;
};

export abstract class StorageService {
  abstract uploadVideoForUser(
    path: string,
    content: Buffer<ArrayBufferLike>,
  ): Promise<UploadVideoResult>;
}
