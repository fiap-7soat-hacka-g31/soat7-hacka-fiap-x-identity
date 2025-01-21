import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadVideoCommand } from '../application/commands/upload-video.command';
import { UploadVideoInput } from '../application/dtos/upload-video.io';

const ONE_HUNDRED_MEGABYTES = 1000 * 1000 * 100;

@Controller({ version: '1', path: 'videos' })
export class UploadVideoController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async execute(
    @Body() input: UploadVideoInput,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: ONE_HUNDRED_MEGABYTES }),
          new FileTypeValidator({ fileType: 'video/mp4' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    input.ownerId = '6592008029c8c3e4dc76256c';
    input.filename = file.originalname;
    input.content = file.buffer;

    const result = await this.commandBus.execute(new UploadVideoCommand(input));
    return result.data;
  }
}
