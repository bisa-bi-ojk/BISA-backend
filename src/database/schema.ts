import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),

  emailVerificationToken: varchar('email_verification_token', { length: 255 }),
  emailVerificationExpires: timestamp('email_verification_expires'),

  otpCode: varchar('otp_code', { length: 6 }),
  otpExpires: timestamp('otp_expires'),

  passwordResetToken: varchar('password_reset_token', { length: 255 }),
  passwordResetExpires: timestamp('password_reset_expires'),

  role: varchar('role', { length: 20 }).default('citizen').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
