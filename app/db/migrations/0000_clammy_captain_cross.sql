CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar(256) NOT NULL
);
