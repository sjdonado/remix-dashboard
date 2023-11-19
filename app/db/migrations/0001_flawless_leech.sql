DO $$ BEGIN
 CREATE TYPE "roles" AS ENUM('admin', 'teacher', 'student');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "roles" DEFAULT 'student' NOT NULL;