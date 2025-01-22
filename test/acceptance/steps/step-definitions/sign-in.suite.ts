import { Given, Suite, Then, When } from '@fiap-x/acceptance-factory';
import { HttpService } from '@nestjs/axios';
import { strict as assert } from 'assert';

@Suite()
export class SignInSuite {
  private userInfo: { name: string; email: string; password: string };
  private responseStatus: number;
  private accessToken: string;

  constructor(private readonly http: HttpService) {}

  @Given('a user has signed up')
  async userInfoForRegistration() {
    this.userInfo = {
      name: 'Jack Sparrow',
      email: 'jack@sparrow.com',
      password: 'j@cK!123',
    };
    await this.http.axiosRef.post('http://localhost:4000/v1/auth/sign-up', {
      ...this.userInfo,
    });
  }

  @When('the user places his signin request')
  async requestIsPlaced() {
    const res = await this.http.axiosRef.post(
      'http://localhost:4000/v1/auth/sign-in',
      { ...this.userInfo },
    );
    this.responseStatus = res.status;
    this.accessToken = res.data.access_token;
  }

  @Then('an access token is granted')
  async verifyUserSignedUp() {
    assert.equal(this.responseStatus, 201);
    assert.ok(this.accessToken);
  }
}
