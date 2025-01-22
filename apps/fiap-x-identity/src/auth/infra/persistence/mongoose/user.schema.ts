import { MongooseEntitySchema } from '@fiap-x/tactical-design/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PasswordAlgorithm } from '../../../domain/values/password.value';

@Schema({ _id: false })
export class MongoosePasswordSchema {
  @Prop({ type: String })
  algorithm: PasswordAlgorithm;

  @Prop()
  salt: string;

  @Prop()
  value: string;
}

@Schema({ collection: 'Users', timestamps: true })
export class MongooseUserSchema extends MongooseEntitySchema {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop({ type: MongoosePasswordSchema })
  password: MongoosePasswordSchema;
}

export const MongooseUserSchemaModel =
  SchemaFactory.createForClass(MongooseUserSchema);

MongooseUserSchemaModel.index({ email: 1, password: 1 }, { unique: true });
