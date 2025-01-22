import {
  AggregateMergeContext,
  TransactionManager,
} from '@fiap-x/tactical-design/core';
import { MongooseRepository } from '@fiap-x/tactical-design/mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../../../application/abstractions/user.repository';
import { User } from '../../../domain/entities/user.aggregate';
import { MongooseUserSchemaFactory } from './user-schema.factory';
import { MongooseUserSchema } from './user.schema';

export class MongooseUserRepository
  extends MongooseRepository<MongooseUserSchema, User>
  implements UserRepository
{
  constructor(
    protected readonly transactionManager: TransactionManager,
    @InjectModel(MongooseUserSchema.name)
    protected readonly Model: Model<MongooseUserSchema>,
    protected readonly schemaFactory: MongooseUserSchemaFactory,
    protected readonly mergeContext: AggregateMergeContext,
  ) {
    super(mergeContext, transactionManager, Model, schemaFactory);
  }

  /* istanbul ignore next */
  async findByEmail(email: string): Promise<User> {
    return this.findOne({ email });
  }
}
