import { EntitySchemaFactory } from '@fiap-x/tactical-design/core';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { User } from '../../../domain/entities/user.aggregate';
import { Email } from '../../../domain/values/email.value';
import { Password } from '../../../domain/values/password.value';
import { MongooseUserSchema } from './user.schema';

@Injectable()
export class MongooseUserSchemaFactory
  implements EntitySchemaFactory<MongooseUserSchema, User>
{
  entityToSchema(entity: User): MongooseUserSchema {
    return {
      _id: new Types.ObjectId(entity.id),
      name: entity.name,
      email: entity.email,
      password: {
        algorithm: entity.password.algorithm,
        salt: entity.password.salt,
        value: entity.password.value,
      },
    };
  }

  schemaToEntity(entitySchema: MongooseUserSchema): User {
    return new User(
      entitySchema._id.toHexString(),
      entitySchema.name,
      new Email(entitySchema.email),
      Password.fromHash(
        entitySchema.password.value,
        entitySchema.password.salt,
        entitySchema.password.algorithm,
      ),
    );
  }
}
