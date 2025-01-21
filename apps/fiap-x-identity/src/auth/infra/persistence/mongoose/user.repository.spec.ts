import {
  AggregateMergeContext,
  TransactionManager,
} from '@fiap-x/tactical-design/core';
import { FakeMongooseModel } from '@fiap-x/test-factory/utils';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../../application/abstractions/user.repository';
import { MongooseUserSchemaFactory } from './user-schema.factory';
import { MongooseUserRepository } from './user.repository';
import { MongooseUserSchema } from './user.schema';

describe('MongooseUserRepository', () => {
  let target: UserRepository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TransactionManager,
          useValue: Object.create(TransactionManager.prototype),
        },
        {
          provide: getModelToken(MongooseUserSchema.name),
          useClass: FakeMongooseModel,
        },
        {
          provide: MongooseUserSchemaFactory,
          useValue: Object.create(MongooseUserSchema.prototype),
        },
        {
          provide: AggregateMergeContext,
          useValue: Object.create(AggregateMergeContext.prototype),
        },
        {
          provide: UserRepository,
          useClass: MongooseUserRepository,
        },
      ],
    }).compile();

    target = moduleFixture.get(UserRepository);
  });

  it('should instantiate correctly', async () => {
    expect(target).toBeInstanceOf(MongooseUserRepository);
  });
});
