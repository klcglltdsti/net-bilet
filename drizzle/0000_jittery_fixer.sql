CREATE TABLE `artists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_user_id` integer,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`bio` text,
	`image_url` text,
	`cover_url` text,
	`category` text,
	`social_links` text,
	`verified` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_artists_slug` ON `artists` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_artists_name` ON `artists` (`name`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`actor_user_id` integer,
	`category` text NOT NULL,
	`action` text NOT NULL,
	`target_type` text,
	`target_id` text,
	`ip_hash` text,
	`metadata` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_audit_category_created` ON `audit_logs` (`category`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_audit_actor_created` ON `audit_logs` (`actor_user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organizer_id` integer NOT NULL,
	`event_id` integer,
	`name` text NOT NULL,
	`code` text,
	`type` text NOT NULL,
	`discount` integer NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`usage_limit` integer,
	`used_count` integer DEFAULT 0 NOT NULL,
	`minimum_cart` integer DEFAULT 0 NOT NULL,
	`audience_rules` text,
	`active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`organizer_id`) REFERENCES `organizers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_campaigns_code` ON `campaigns` (`code`);--> statement-breakpoint
CREATE INDEX `idx_campaigns_event_active` ON `campaigns` (`event_id`,`active`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`icon` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_categories_slug` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`event_id` integer NOT NULL,
	`text` text NOT NULL,
	`rating` integer NOT NULL,
	`verified_attendance` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'VISIBLE' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_comments_event_status_created` ON `comments` (`event_id`,`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `event_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`venue_id` integer NOT NULL,
	`hall_id` integer,
	`city` text NOT NULL,
	`date` text NOT NULL,
	`start_time` text NOT NULL,
	`door_time` text,
	`capacity` integer NOT NULL,
	`remaining_capacity` integer NOT NULL,
	`status` text DEFAULT 'SCHEDULED' NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`venue_id`) REFERENCES `venues`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`hall_id`) REFERENCES `venue_halls`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_sessions_event_date` ON `event_sessions` (`event_id`,`date`);--> statement-breakpoint
CREATE INDEX `idx_sessions_city_date` ON `event_sessions` (`city`,`date`);--> statement-breakpoint
CREATE INDEX `idx_sessions_venue_date` ON `event_sessions` (`venue_id`,`date`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organizer_id` integer NOT NULL,
	`artist_id` integer,
	`category_id` integer NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`cover_image` text,
	`trailer_url` text,
	`duration_minutes` integer,
	`age_limit` integer,
	`language` text DEFAULT 'tr' NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`sponsored` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organizer_id`) REFERENCES `organizers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_events_slug` ON `events` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_events_category_status` ON `events` (`category_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_events_organizer` ON `events` (`organizer_id`);--> statement-breakpoint
CREATE TABLE `follows` (
	`user_id` integer NOT NULL,
	`target_type` text NOT NULL,
	`target_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`user_id`, `target_type`, `target_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_follows_target` ON `follows` (`target_type`,`target_id`);--> statement-breakpoint
CREATE TABLE `friends` (
	`requester_id` integer NOT NULL,
	`addressee_id` integer NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`requester_id`, `addressee_id`),
	FOREIGN KEY (`requester_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`addressee_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_friends_addressee_status` ON `friends` (`addressee_id`,`status`);--> statement-breakpoint
CREATE TABLE `likes` (
	`user_id` integer NOT NULL,
	`target_type` text NOT NULL,
	`target_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`user_id`, `target_type`, `target_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_likes_target` ON `likes` (`target_type`,`target_id`);--> statement-breakpoint
CREATE TABLE `matches` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` integer NOT NULL,
	`requester_id` integer NOT NULL,
	`candidate_id` integer,
	`preferences` text,
	`score` real,
	`status` text DEFAULT 'WAITING' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `event_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`requester_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`candidate_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_matches_session_status` ON `matches` (`session_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_matches_requester` ON `matches` (`requester_id`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`match_id` integer NOT NULL,
	`sender_id` integer NOT NULL,
	`body` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_messages_match_created` ON `messages` (`match_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `moderation_reports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reporter_id` integer NOT NULL,
	`target_type` text NOT NULL,
	`target_id` integer NOT NULL,
	`reason` text NOT NULL,
	`detail` text,
	`status` text DEFAULT 'OPEN' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_moderation_status_created` ON `moderation_reports` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_moderation_target` ON `moderation_reports` (`target_type`,`target_id`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`type` text NOT NULL,
	`channel` text DEFAULT 'IN_APP' NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`action_url` text,
	`read_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_notifications_user_read_created` ON `notifications` (`user_id`,`read_at`,`created_at`);--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`ticket_id` integer,
	`name` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`unit_price` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_order_items_order` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_number` text NOT NULL,
	`user_id` integer NOT NULL,
	`campaign_id` integer,
	`subtotal_amount` integer NOT NULL,
	`discount_amount` integer DEFAULT 0 NOT NULL,
	`service_fee` integer DEFAULT 0 NOT NULL,
	`total_amount` integer NOT NULL,
	`currency` text DEFAULT 'TRY' NOT NULL,
	`payment_status` text DEFAULT 'PENDING' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_orders_number` ON `orders` (`order_number`);--> statement-breakpoint
CREATE INDEX `idx_orders_user_created` ON `orders` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_orders_payment_status` ON `orders` (`payment_status`);--> statement-breakpoint
CREATE TABLE `organizers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_user_id` integer NOT NULL,
	`company_name` text NOT NULL,
	`logo_url` text,
	`description` text,
	`website` text,
	`social_links` text,
	`package` text DEFAULT 'STANDARD' NOT NULL,
	`commission_rate` real DEFAULT 10 NOT NULL,
	`verification_status` text DEFAULT 'PENDING' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_organizers_verification` ON `organizers` (`verification_status`);--> statement-breakpoint
CREATE TABLE `payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`provider` text NOT NULL,
	`transaction_id` text,
	`amount` integer NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`fraud_score` real,
	`provider_payload` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_payments_transaction` ON `payments` (`transaction_id`);--> statement-breakpoint
CREATE INDEX `idx_payments_order` ON `payments` (`order_id`);--> statement-breakpoint
CREATE TABLE `payouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organizer_id` integer NOT NULL,
	`period_start` text NOT NULL,
	`period_end` text NOT NULL,
	`gross_amount` integer NOT NULL,
	`commission_amount` integer NOT NULL,
	`payment_fees` integer DEFAULT 0 NOT NULL,
	`refund_amount` integer DEFAULT 0 NOT NULL,
	`net_amount` integer NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`paid_at` text,
	FOREIGN KEY (`organizer_id`) REFERENCES `organizers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_payouts_organizer_status` ON `payouts` (`organizer_id`,`status`);--> statement-breakpoint
CREATE TABLE `recommendation_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`event_id` integer NOT NULL,
	`action` text NOT NULL,
	`dwell_seconds` integer,
	`context` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_recommendations_user_action` ON `recommendation_events` (`user_id`,`action`);--> statement-breakpoint
CREATE INDEX `idx_recommendations_event_action` ON `recommendation_events` (`event_id`,`action`);--> statement-breakpoint
CREATE TABLE `roles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_roles_name` ON `roles` (`name`);--> statement-breakpoint
CREATE TABLE `seat_layouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hall_id` integer NOT NULL,
	`section` text DEFAULT 'Salon' NOT NULL,
	`row_name` text NOT NULL,
	`seat_number` integer NOT NULL,
	`seat_type` text DEFAULT 'STANDARD' NOT NULL,
	`x` real,
	`y` real,
	FOREIGN KEY (`hall_id`) REFERENCES `venue_halls`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_seat_layout_unique` ON `seat_layouts` (`hall_id`,`section`,`row_name`,`seat_number`);--> statement-breakpoint
CREATE TABLE `seat_locks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`seat_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`lock_token` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`seat_id`) REFERENCES `seats`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_seat_locks_seat` ON `seat_locks` (`seat_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_seat_locks_token` ON `seat_locks` (`lock_token`);--> statement-breakpoint
CREATE INDEX `idx_seat_locks_expiry` ON `seat_locks` (`expires_at`);--> statement-breakpoint
CREATE TABLE `seats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` integer NOT NULL,
	`layout_seat_id` integer,
	`ticket_type_id` integer NOT NULL,
	`section` text NOT NULL,
	`row_name` text NOT NULL,
	`seat_number` integer NOT NULL,
	`price` integer NOT NULL,
	`status` text DEFAULT 'AVAILABLE' NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `event_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`layout_seat_id`) REFERENCES `seat_layouts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ticket_type_id`) REFERENCES `ticket_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_seats_session_position` ON `seats` (`session_id`,`section`,`row_name`,`seat_number`);--> statement-breakpoint
CREATE INDEX `idx_seats_session_status` ON `seats` (`session_id`,`status`);--> statement-breakpoint
CREATE TABLE `stories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_type` text NOT NULL,
	`owner_id` integer NOT NULL,
	`media_type` text NOT NULL,
	`media_url` text,
	`text` text,
	`event_id` integer,
	`campaign_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_stories_owner_expiry` ON `stories` (`owner_type`,`owner_id`,`expires_at`);--> statement-breakpoint
CREATE INDEX `idx_stories_expiry` ON `stories` (`expires_at`);--> statement-breakpoint
CREATE TABLE `support_tickets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`category` text NOT NULL,
	`subject` text NOT NULL,
	`description` text NOT NULL,
	`status` text DEFAULT 'OPEN' NOT NULL,
	`assigned_to` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_support_status_created` ON `support_tickets` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_support_user` ON `support_tickets` (`user_id`);--> statement-breakpoint
CREATE TABLE `ticket_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` integer NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`capacity` integer NOT NULL,
	`sale_start` text,
	`sale_end` text,
	FOREIGN KEY (`session_id`) REFERENCES `event_sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_ticket_types_session` ON `ticket_types` (`session_id`);--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`session_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`seat_id` integer,
	`qr_token_hash` text NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`transferred_from_user_id` integer,
	`used_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`session_id`) REFERENCES `event_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`seat_id`) REFERENCES `seats`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`transferred_from_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_tickets_qr_hash` ON `tickets` (`qr_token_hash`);--> statement-breakpoint
CREATE INDEX `idx_tickets_user_status` ON `tickets` (`user_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_tickets_session` ON `tickets` (`session_id`);--> statement-breakpoint
CREATE TABLE `user_interests` (
	`user_id` integer NOT NULL,
	`category_id` integer NOT NULL,
	`weight` real DEFAULT 1 NOT NULL,
	PRIMARY KEY(`user_id`, `category_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_rewards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`reward_id` integer NOT NULL,
	`code` text NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reward_id`) REFERENCES `wheel_rewards`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_user_rewards_code` ON `user_rewards` (`code`);--> statement-breakpoint
CREATE INDEX `idx_user_rewards_user_status` ON `user_rewards` (`user_id`,`status`);--> statement-breakpoint
CREATE TABLE `user_settings` (
	`user_id` integer PRIMARY KEY NOT NULL,
	`notification_enabled` integer DEFAULT true NOT NULL,
	`email_notification` integer DEFAULT true NOT NULL,
	`sms_notification` integer DEFAULT false NOT NULL,
	`campaign_notification` integer DEFAULT true NOT NULL,
	`friend_activity_notification` integer DEFAULT true NOT NULL,
	`profile_visibility` text DEFAULT 'PUBLIC' NOT NULL,
	`show_activity` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`role_id` integer,
	`name` text NOT NULL,
	`surname` text DEFAULT '' NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`password_hash` text,
	`avatar_url` text,
	`birth_date` text,
	`city` text DEFAULT 'Ankara' NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`verified_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_users_uuid` ON `users` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_users_email` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_users_phone` ON `users` (`phone`);--> statement-breakpoint
CREATE INDEX `idx_users_role_status` ON `users` (`role_id`,`status`);--> statement-breakpoint
CREATE TABLE `venue_halls` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`venue_id` integer NOT NULL,
	`name` text NOT NULL,
	`capacity` integer NOT NULL,
	`layout_type` text DEFAULT 'SEATED' NOT NULL,
	FOREIGN KEY (`venue_id`) REFERENCES `venues`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_venue_halls_venue` ON `venue_halls` (`venue_id`);--> statement-breakpoint
CREATE TABLE `venues` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_user_id` integer,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`phone` text,
	`latitude` real,
	`longitude` real,
	`capacity` integer DEFAULT 0 NOT NULL,
	`logo_url` text,
	`cover_url` text,
	`verified` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_venues_slug` ON `venues` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_venues_city_name` ON `venues` (`city`,`name`);--> statement-breakpoint
CREATE TABLE `wheel_rewards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`value` integer NOT NULL,
	`probability_weight` integer NOT NULL,
	`weekly_limit` integer,
	`active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
PRAGMA optimize;
