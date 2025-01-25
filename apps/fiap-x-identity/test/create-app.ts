import { createTestApp as baseCreateTestApp } from '@fiap-x/test-factory/utils';
import { AppModule } from '../src/app.module';

export const env = {
  APP_NAME: 'fiap-x-identity-test-app',
  APP_DESCRIPTION: 'Identity Component for Fiap X',
  APP_VERSION: '1.0.0',
};

export const createTestApp = (silentLogger: boolean = true) =>
  baseCreateTestApp(AppModule, { env, silentLogger });
