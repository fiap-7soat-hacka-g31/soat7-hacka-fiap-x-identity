export type FileUploadInput = {
  bucket: string;
  path: string;
  content: Buffer<ArrayBufferLike>;
};

export type FileUploadOutput = {
  provider: string;
  bucket: string;
  path: string;
};
