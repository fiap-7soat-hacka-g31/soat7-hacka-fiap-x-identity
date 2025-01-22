import { Repository } from '@fiap-x/tactical-design/core';
import { User } from '../../domain/entities/user.aggregate';

export abstract class UserRepository implements Repository<User> {
  abstract create(entity: User): Promise<void>;
  abstract update(entity: User): Promise<void>;
  abstract findById(id: string): Promise<User>;
  abstract findAll(): Promise<User[]>;
  abstract newId(): string;
  abstract findByEmail(email: string): Promise<User>;
}
