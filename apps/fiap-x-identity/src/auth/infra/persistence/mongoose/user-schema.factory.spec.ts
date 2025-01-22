import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { User } from '../../../domain/entities/user.aggregate';
import { Email } from '../../../domain/values/email.value';
import {
  EPasswordAlgorithm,
  Password,
} from '../../../domain/values/password.value';
import { MongooseUserSchemaFactory } from './user-schema.factory';
import { MongooseUserSchema } from './user.schema';

const getValidPassword = () => 'j@cK!Sp4rr0w';

const password = Password.fromPlain(
  getValidPassword(),
  EPasswordAlgorithm.PBKDF2,
);

const getFullAggregate = (): User =>
  new User(
    new Types.ObjectId().toHexString(),
    'Jack Sparrow',
    new Email('jack@sparrow.com'),
    Password.fromHash(password.value, password.salt, password.algorithm),
  );

const getFullSchema = (): MongooseUserSchema => {
  return {
    _id: new Types.ObjectId(),
    name: 'Jack Sparrow',
    email: 'jack@sparrow.com',
    password: {
      algorithm: password.algorithm,
      salt: password.salt,
      value: password.value,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

describe('MongooseUserSchemaFactory', () => {
  let app: INestApplication;
  let target: MongooseUserSchemaFactory;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [MongooseUserSchemaFactory],
    }).compile();

    app = moduleFixture.createNestApplication();
    target = app.get(MongooseUserSchemaFactory);
  });

  it('should transform a User entity into a MongooseSchema', async () => {
    const actual = getFullAggregate();
    const result = target.entityToSchema(actual);
    expect(result._id).toBeInstanceOf(Types.ObjectId);
    expect(result._id.toHexString()).toBe(actual.id);
    expect(result).not.toBeInstanceOf(User);
  });

  it('should transform a MongooseSchema into a User entity', async () => {
    const actual = getFullSchema();
    const result = target.schemaToEntity(actual);
    expect(result.id).not.toBeInstanceOf(Types.ObjectId);
    expect(result.id).toBe(actual._id.toHexString());
    expect(result).toBeInstanceOf(User);
  });
});
