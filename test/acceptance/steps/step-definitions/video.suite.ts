import { Given, Suite, Then, When } from '@fiap-x/acceptance-factory';
import { HttpService } from '@nestjs/axios';
import { strict as assert } from 'assert';
import { randomUUID } from 'crypto';
import * as FormData from 'form-data';
import { createReadStream } from 'fs';
import { join } from 'path';
import { setTimeout } from 'timers/promises';

@Suite()
export class VideoSuite {
  private id: string;

  constructor(private readonly http: HttpService) {}

  @Given('a video is sent to the service')
  async uploadVideo() {
    const filename = `${randomUUID()}.mp4`;
    const form = new FormData();
    const path = join(__dirname, '..', '..', '..', 'resources', 'video.mp4');
    const stream = createReadStream(path);
    form.append('file', stream, { filename });
    const res = await this.http.axiosRef.post(
      'http://localhost:4000/v1/videos/upload',
      form,
      { headers: form.getHeaders() },
    );
    this.id = res.data.id;
    await setTimeout(500);
  }

  @When('the app finishes storing the video')
  async appFinishedStoringVideo() {
    // noop: response is synchronous
  }

  @Then('the user received the video id')
  async verifyIdExists() {
    assert.ok(this.id);
  }
}
