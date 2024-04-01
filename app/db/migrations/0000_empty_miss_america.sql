CREATE TABLE `assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text NOT NULL,
	`status` text DEFAULT 'OPEN' NOT NULL,
	`type` text DEFAULT 'HOMEWORK' NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`points` integer NOT NULL,
	`due_at` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`role` text DEFAULT 'STUDENT' NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);