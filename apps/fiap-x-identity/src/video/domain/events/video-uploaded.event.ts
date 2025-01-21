import { DomainEvent } from '@fiap-x/tactical-design/core';

export class VideoUploaded extends DomainEvent {
  constructor(
    public readonly provider: string,
    public readonly bucket: string,
    public readonly path: string,
  ) {
    super();
  }
}
