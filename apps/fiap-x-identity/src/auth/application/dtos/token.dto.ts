export class AccessToken {
  access_token: string;

  constructor(values: AccessToken) {
    Object.assign(this, values);
  }
}
