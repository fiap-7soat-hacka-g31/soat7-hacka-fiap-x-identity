import { And, Given, Suite, Then, When } from '@fiap-x/acceptance-factory';
import { HttpService } from '@nestjs/axios';
import { strict as assert } from 'assert';
import { randomUUID } from 'crypto';

@Suite()
export class SignUpSuite {
  private userInfo: { name: string; email: string; password: string };
  private responseStatus: number;
  private accessToken: string;

  constructor(private readonly http: HttpService) {}

  @Given('a new user wants to register')
  async userInfoForRegistration() {
    this.userInfo = {
      name: 'Jack Sparrow',
      email: `${randomUUID().split('-').at(0)}jack@sparrow.com`,
      password: 'j@cK!123',
    };
  }

  @When('the user places his signup request')
  async requestIsPlaced() {
    const res = await this.http.axiosRef.post(
      'http://localhost:4000/v1/auth/sign-up',
      { ...this.userInfo },
    );
    this.responseStatus = res.status;
    this.accessToken = res.data.access_token;
  }

  @Then('the user is signed up')
  async verifyUserSignedUp() {
    assert.equal(this.responseStatus, 201);
  }

  @And('an access token is returned')
  async verifyAccessToken() {
    assert.ok(this.accessToken);
  }
}
