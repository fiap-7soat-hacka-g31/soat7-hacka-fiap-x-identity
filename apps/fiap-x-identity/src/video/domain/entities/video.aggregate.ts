import { AggregateRoot } from '@fiap-x/tactical-design/core';
import { VideoUploaded } from '../events/video-uploaded.event';
import { CloudFile } from '../values/cloud-file.value';
import { VideoStatus } from '../values/video-status.value';

export class Video extends AggregateRoot {
  constructor(
    protected readonly _id: string,
    private readonly _filename: string,
    private readonly _ownerId: string,
    private _status: VideoStatus,
    private readonly _snapshotIntervalInSeconds: number = 5,
    private _videoFile: CloudFile = null,
    private _zipFile: CloudFile = null,
  ) {
    super(_id);
  }

  get filename() {
    return this._filename;
  }

  get ownerId() {
    return this._ownerId;
  }

  get status() {
    return this._status.value;
  }

  get snapshotIntervalInSeconds() {
    return this._snapshotIntervalInSeconds;
  }

  get videoFile() {
    return this._videoFile;
  }

  get zipFile() {
    return this._zipFile;
  }

  upload(provider: string, bucket: string, path: string) {
    this.apply(new VideoUploaded(provider, bucket, path));
  }

  onVideoUploaded(event: VideoUploaded) {
    this._status = VideoStatus.new();
    this._videoFile = new CloudFile(event.provider, event.bucket, event.path);
  }
}
