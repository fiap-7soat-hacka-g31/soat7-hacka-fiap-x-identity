import { UploadVideoInput, UploadVideoOutput } from '../dtos/upload-video.io';

export class UploadVideoCommand {
  constructor(readonly data: UploadVideoInput) {}
}

export class UploadVideoResult {
  constructor(readonly data: UploadVideoOutput) {}
}
