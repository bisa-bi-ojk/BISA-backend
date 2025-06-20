import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DATABASE_CONNECTION } from '../database/database.module';
import { NewUser, User, users } from '../database/schema';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: PostgresJsDatabase<
      typeof import('../database/schema')
    >,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user ?? null;
  }

  async findById(id: number): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user ?? null;
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.emailVerificationToken, token))
      .limit(1);
    return user ?? null;
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.passwordResetToken, token))
      .limit(1);
    return user ?? null;
  }

  async create(payload: NewUser): Promise<User> {
    const [user] = await this.db.insert(users).values(payload).returning();
    return user;
  }

  async update(id: number, fields: Partial<NewUser>): Promise<User> {
    const [user] = await this.db
      .update(users)
      .set(fields)
      .where(eq(users.id, id))
      .returning();
    return user;
  }
}
