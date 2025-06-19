ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "full_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verification_expires" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "otp_code" varchar(6);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "otp_expires" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" varchar(20) DEFAULT 'citizen' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "first_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "last_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_email_verified";