import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenProvider } from '../application/abstractions/token.provider';
import { UserRepository } from '../application/abstractions/user.repository';
import { TokenService } from './adapters/token-providers/token.service';
import { MongooseUserSchemaFactory } from './persistence/mongoose/user-schema.factory';
import { MongooseUserRepository } from './persistence/mongoose/user.repository';
import {
  MongooseUserSchema,
  MongooseUserSchemaModel,
} from './persistence/mongoose/user.schema';

const MongooseSchemaModule = MongooseModule.forFeature([
  {
    name: MongooseUserSchema.name,
    schema: MongooseUserSchemaModel,
  },
]);

MongooseSchemaModule.global = true;

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.getOrThrow('JWT_SIGNING_SECRET');
        const expiresIn = config.getOrThrow('JWT_EXPIRES_IN');
        return { secret, signOptions: { expiresIn } };
      },
    }),
    MongooseSchemaModule,
  ],
  providers: [
    MongooseUserSchemaFactory,
    {
      provide: UserRepository,
      useClass: MongooseUserRepository,
    },
    {
      provide: TokenProvider,
      useClass: TokenService,
    },
  ],
  exports: [UserRepository, TokenProvider],
})
export class InfraModule {}
