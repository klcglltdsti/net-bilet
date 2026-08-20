import { sql } from "drizzle-orm";
import { index, integer, primaryKey, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamp = (name: string) => text(name).notNull().default(sql`CURRENT_TIMESTAMP`);

export const roles = sqliteTable("roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { enum: ["USER", "ORGANIZER", "ARTIST", "VENUE", "STAFF", "ADMIN"] }).notNull(),
}, (t) => [uniqueIndex("idx_roles_name").on(t.name)]);

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uuid: text("uuid").notNull(),
  roleId: integer("role_id").references(() => roles.id),
  name: text("name").notNull(),
  surname: text("surname").notNull().default(""),
  email: text("email").notNull(),
  phone: text("phone"),
  passwordHash: text("password_hash"),
  avatarUrl: text("avatar_url"),
  birthDate: text("birth_date"),
  city: text("city").notNull().default("Ankara"),
  status: text("status", { enum: ["PENDING", "ACTIVE", "BLOCKED", "DELETED"] }).notNull().default("ACTIVE"),
  verifiedAt: text("verified_at"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
}, (t) => [uniqueIndex("idx_users_uuid").on(t.uuid), uniqueIndex("idx_users_email").on(t.email), uniqueIndex("idx_users_phone").on(t.phone), index("idx_users_role_status").on(t.roleId, t.status)]);

export const userSettings = sqliteTable("user_settings", {
  userId: integer("user_id").primaryKey().references(() => users.id),
  notificationEnabled: integer("notification_enabled", { mode: "boolean" }).notNull().default(true),
  emailNotification: integer("email_notification", { mode: "boolean" }).notNull().default(true),
  smsNotification: integer("sms_notification", { mode: "boolean" }).notNull().default(false),
  campaignNotification: integer("campaign_notification", { mode: "boolean" }).notNull().default(true),
  friendActivityNotification: integer("friend_activity_notification", { mode: "boolean" }).notNull().default(true),
  profileVisibility: text("profile_visibility", { enum: ["PUBLIC", "FRIENDS", "PRIVATE"] }).notNull().default("PUBLIC"),
  showActivity: integer("show_activity", { mode: "boolean" }).notNull().default(true),
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  icon: text("icon"),
}, (t) => [uniqueIndex("idx_categories_slug").on(t.slug)]);

export const userInterests = sqliteTable("user_interests", {
  userId: integer("user_id").notNull().references(() => users.id),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  weight: real("weight").notNull().default(1),
}, (t) => [primaryKey({ columns: [t.userId, t.categoryId] })]);

export const organizers = sqliteTable("organizers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerUserId: integer("owner_user_id").notNull().references(() => users.id),
  companyName: text("company_name").notNull(),
  logoUrl: text("logo_url"),
  description: text("description"),
  website: text("website"),
  socialLinks: text("social_links", { mode: "json" }),
  package: text("package", { enum: ["STANDARD", "PRO", "CORPORATE"] }).notNull().default("STANDARD"),
  commissionRate: real("commission_rate").notNull().default(10),
  verificationStatus: text("verification_status", { enum: ["PENDING", "APPROVED", "REJECTED"] }).notNull().default("PENDING"),
  createdAt: timestamp("created_at"),
}, (t) => [index("idx_organizers_verification").on(t.verificationStatus)]);

export const artists = sqliteTable("artists", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerUserId: integer("owner_user_id").references(() => users.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  bio: text("bio"),
  imageUrl: text("image_url"),
  coverUrl: text("cover_url"),
  category: text("category"),
  socialLinks: text("social_links", { mode: "json" }),
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  createdAt: timestamp("created_at"),
}, (t) => [uniqueIndex("idx_artists_slug").on(t.slug), index("idx_artists_name").on(t.name)]);

export const venues = sqliteTable("venues", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerUserId: integer("owner_user_id").references(() => users.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  phone: text("phone"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  capacity: integer("capacity").notNull().default(0),
  logoUrl: text("logo_url"),
  coverUrl: text("cover_url"),
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  createdAt: timestamp("created_at"),
}, (t) => [uniqueIndex("idx_venues_slug").on(t.slug), index("idx_venues_city_name").on(t.city, t.name)]);

export const venueHalls = sqliteTable("venue_halls", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  venueId: integer("venue_id").notNull().references(() => venues.id),
  name: text("name").notNull(),
  capacity: integer("capacity").notNull(),
  layoutType: text("layout_type", { enum: ["SEATED", "GENERAL_ADMISSION", "MIXED"] }).notNull().default("SEATED"),
}, (t) => [index("idx_venue_halls_venue").on(t.venueId)]);

export const seatLayouts = sqliteTable("seat_layouts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  hallId: integer("hall_id").notNull().references(() => venueHalls.id),
  section: text("section").notNull().default("Salon"),
  rowName: text("row_name").notNull(),
  seatNumber: integer("seat_number").notNull(),
  seatType: text("seat_type", { enum: ["STANDARD", "VIP", "ACCESSIBLE", "COMPANION"] }).notNull().default("STANDARD"),
  x: real("x"),
  y: real("y"),
}, (t) => [uniqueIndex("idx_seat_layout_unique").on(t.hallId, t.section, t.rowName, t.seatNumber)]);

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizerId: integer("organizer_id").notNull().references(() => organizers.id),
  artistId: integer("artist_id").references(() => artists.id),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  coverImage: text("cover_image"),
  trailerUrl: text("trailer_url"),
  durationMinutes: integer("duration_minutes"),
  ageLimit: integer("age_limit"),
  language: text("language").notNull().default("tr"),
  status: text("status", { enum: ["DRAFT", "PENDING", "PUBLISHED", "REJECTED", "ARCHIVED", "CANCELLED"] }).notNull().default("DRAFT"),
  sponsored: integer("sponsored", { mode: "boolean" }).notNull().default(false),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
}, (t) => [uniqueIndex("idx_events_slug").on(t.slug), index("idx_events_category_status").on(t.categoryId, t.status), index("idx_events_organizer").on(t.organizerId)]);

export const eventSessions = sqliteTable("event_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventId: integer("event_id").notNull().references(() => events.id),
  venueId: integer("venue_id").notNull().references(() => venues.id),
  hallId: integer("hall_id").references(() => venueHalls.id),
  city: text("city").notNull(),
  date: text("date").notNull(),
  startTime: text("start_time").notNull(),
  doorTime: text("door_time"),
  capacity: integer("capacity").notNull(),
  remainingCapacity: integer("remaining_capacity").notNull(),
  status: text("status", { enum: ["SCHEDULED", "SOLD_OUT", "CANCELLED", "COMPLETED"] }).notNull().default("SCHEDULED"),
}, (t) => [index("idx_sessions_event_date").on(t.eventId, t.date), index("idx_sessions_city_date").on(t.city, t.date), index("idx_sessions_venue_date").on(t.venueId, t.date)]);

export const ticketTypes = sqliteTable("ticket_types", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: integer("session_id").notNull().references(() => eventSessions.id),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  capacity: integer("capacity").notNull(),
  saleStart: text("sale_start"),
  saleEnd: text("sale_end"),
}, (t) => [index("idx_ticket_types_session").on(t.sessionId)]);

export const seats = sqliteTable("seats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: integer("session_id").notNull().references(() => eventSessions.id),
  layoutSeatId: integer("layout_seat_id").references(() => seatLayouts.id),
  ticketTypeId: integer("ticket_type_id").notNull().references(() => ticketTypes.id),
  section: text("section").notNull(),
  rowName: text("row_name").notNull(),
  seatNumber: integer("seat_number").notNull(),
  price: integer("price").notNull(),
  status: text("status", { enum: ["AVAILABLE", "LOCKED", "SOLD", "BLOCKED"] }).notNull().default("AVAILABLE"),
}, (t) => [uniqueIndex("idx_seats_session_position").on(t.sessionId, t.section, t.rowName, t.seatNumber), index("idx_seats_session_status").on(t.sessionId, t.status)]);

export const seatLocks = sqliteTable("seat_locks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  seatId: integer("seat_id").notNull().references(() => seats.id),
  userId: integer("user_id").notNull().references(() => users.id),
  lockToken: text("lock_token").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: timestamp("created_at"),
}, (t) => [uniqueIndex("idx_seat_locks_seat").on(t.seatId), uniqueIndex("idx_seat_locks_token").on(t.lockToken), index("idx_seat_locks_expiry").on(t.expiresAt)]);

export const campaigns = sqliteTable("campaigns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizerId: integer("organizer_id").notNull().references(() => organizers.id),
  eventId: integer("event_id").references(() => events.id),
  name: text("name").notNull(),
  code: text("code"),
  type: text("type", { enum: ["PERCENT", "FIXED", "EARLY_BIRD", "GROUP", "COUPON"] }).notNull(),
  discount: integer("discount").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").notNull().default(0),
  minimumCart: integer("minimum_cart").notNull().default(0),
  audienceRules: text("audience_rules", { mode: "json" }),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
}, (t) => [uniqueIndex("idx_campaigns_code").on(t.code), index("idx_campaigns_event_active").on(t.eventId, t.active)]);

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderNumber: text("order_number").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  subtotalAmount: integer("subtotal_amount").notNull(),
  discountAmount: integer("discount_amount").notNull().default(0),
  serviceFee: integer("service_fee").notNull().default(0),
  totalAmount: integer("total_amount").notNull(),
  currency: text("currency").notNull().default("TRY"),
  paymentStatus: text("payment_status", { enum: ["PENDING", "PAID", "FAILED", "PARTIALLY_REFUNDED", "REFUNDED"] }).notNull().default("PENDING"),
  createdAt: timestamp("created_at"),
}, (t) => [uniqueIndex("idx_orders_number").on(t.orderNumber), index("idx_orders_user_created").on(t.userId, t.createdAt), index("idx_orders_payment_status").on(t.paymentStatus)]);

export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull().references(() => orders.id),
  provider: text("provider").notNull(),
  transactionId: text("transaction_id"),
  amount: integer("amount").notNull(),
  status: text("status", { enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"] }).notNull().default("PENDING"),
  fraudScore: real("fraud_score"),
  providerPayload: text("provider_payload", { mode: "json" }),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
}, (t) => [uniqueIndex("idx_payments_transaction").on(t.transactionId), index("idx_payments_order").on(t.orderId)]);

export const tickets = sqliteTable("tickets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull().references(() => orders.id),
  sessionId: integer("session_id").notNull().references(() => eventSessions.id),
  userId: integer("user_id").notNull().references(() => users.id),
  seatId: integer("seat_id").references(() => seats.id),
  qrTokenHash: text("qr_token_hash").notNull(),
  status: text("status", { enum: ["ACTIVE", "TRANSFER_PENDING", "USED", "CANCELLED", "REFUNDED"] }).notNull().default("ACTIVE"),
  transferredFromUserId: integer("transferred_from_user_id").references(() => users.id),
  usedAt: text("used_at"),
  createdAt: timestamp("created_at"),
}, (t) => [uniqueIndex("idx_tickets_qr_hash").on(t.qrTokenHash), index("idx_tickets_user_status").on(t.userId, t.status), index("idx_tickets_session").on(t.sessionId)]);

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull().references(() => orders.id),
  ticketId: integer("ticket_id").references(() => tickets.id),
  name: text("name").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: integer("unit_price").notNull(),
}, (t) => [index("idx_order_items_order").on(t.orderId)]);

export const stories = sqliteTable("stories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerType: text("owner_type", { enum: ["ARTIST", "ORGANIZER", "VENUE"] }).notNull(),
  ownerId: integer("owner_id").notNull(),
  mediaType: text("media_type", { enum: ["IMAGE", "VIDEO", "TEXT"] }).notNull(),
  mediaUrl: text("media_url"),
  text: text("text"),
  eventId: integer("event_id").references(() => events.id),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  createdAt: timestamp("created_at"),
  expiresAt: text("expires_at").notNull(),
}, (t) => [index("idx_stories_owner_expiry").on(t.ownerType, t.ownerId, t.expiresAt), index("idx_stories_expiry").on(t.expiresAt)]);

export const follows = sqliteTable("follows", {
  userId: integer("user_id").notNull().references(() => users.id),
  targetType: text("target_type", { enum: ["USER", "ARTIST", "ORGANIZER", "VENUE"] }).notNull(),
  targetId: integer("target_id").notNull(),
  createdAt: timestamp("created_at"),
}, (t) => [primaryKey({ columns: [t.userId, t.targetType, t.targetId] }), index("idx_follows_target").on(t.targetType, t.targetId)]);

export const friends = sqliteTable("friends", {
  requesterId: integer("requester_id").notNull().references(() => users.id),
  addresseeId: integer("addressee_id").notNull().references(() => users.id),
  status: text("status", { enum: ["PENDING", "ACCEPTED", "BLOCKED"] }).notNull().default("PENDING"),
  createdAt: timestamp("created_at"),
}, (t) => [primaryKey({ columns: [t.requesterId, t.addresseeId] }), index("idx_friends_addressee_status").on(t.addresseeId, t.status)]);

export const likes = sqliteTable("likes", {
  userId: integer("user_id").notNull().references(() => users.id),
  targetType: text("target_type", { enum: ["EVENT", "STORY", "COMMENT"] }).notNull(),
  targetId: integer("target_id").notNull(),
  createdAt: timestamp("created_at"),
}, (t) => [primaryKey({ columns: [t.userId, t.targetType, t.targetId] }), index("idx_likes_target").on(t.targetType, t.targetId)]);

export const comments = sqliteTable("comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  eventId: integer("event_id").notNull().references(() => events.id),
  text: text("text").notNull(),
  rating: integer("rating").notNull(),
  verifiedAttendance: integer("verified_attendance", { mode: "boolean" }).notNull().default(false),
  status: text("status", { enum: ["VISIBLE", "HIDDEN", "REMOVED"] }).notNull().default("VISIBLE"),
  createdAt: timestamp("created_at"),
}, (t) => [index("idx_comments_event_status_created").on(t.eventId, t.status, t.createdAt)]);

export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type", { enum: ["SOCIAL", "EVENT", "TICKET", "CAMPAIGN", "SYSTEM"] }).notNull(),
  channel: text("channel", { enum: ["IN_APP", "PUSH", "EMAIL", "SMS"] }).notNull().default("IN_APP"),
  title: text("title").notNull(),
  message: text("message").notNull(),
  actionUrl: text("action_url"),
  readAt: text("read_at"),
  createdAt: timestamp("created_at"),
}, (t) => [index("idx_notifications_user_read_created").on(t.userId, t.readAt, t.createdAt)]);

export const recommendationEvents = sqliteTable("recommendation_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  eventId: integer("event_id").notNull().references(() => events.id),
  action: text("action", { enum: ["IMPRESSION", "VIEW", "FAVORITE", "SHARE", "CART", "PURCHASE", "SKIP"] }).notNull(),
  dwellSeconds: integer("dwell_seconds"),
  context: text("context", { mode: "json" }),
  createdAt: timestamp("created_at"),
}, (t) => [index("idx_recommendations_user_action").on(t.userId, t.action), index("idx_recommendations_event_action").on(t.eventId, t.action)]);

export const matches = sqliteTable("matches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: integer("session_id").notNull().references(() => eventSessions.id),
  requesterId: integer("requester_id").notNull().references(() => users.id),
  candidateId: integer("candidate_id").references(() => users.id),
  preferences: text("preferences", { mode: "json" }),
  score: real("score"),
  status: text("status", { enum: ["WAITING", "PROPOSED", "ACCEPTED", "REJECTED", "CANCELLED"] }).notNull().default("WAITING"),
  createdAt: timestamp("created_at"),
}, (t) => [index("idx_matches_session_status").on(t.sessionId, t.status), index("idx_matches_requester").on(t.requesterId)]);

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  matchId: integer("match_id").notNull().references(() => matches.id),
  senderId: integer("sender_id").notNull().references(() => users.id),
  body: text("body").notNull(),
  createdAt: timestamp("created_at"),
}, (t) => [index("idx_messages_match_created").on(t.matchId, t.createdAt)]);

export const wheelRewards = sqliteTable("wheel_rewards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type", { enum: ["FREE_TICKET", "PERCENT", "FIXED", "TWO_FOR_ONE", "BADGE"] }).notNull(),
  value: integer("value").notNull(),
  probabilityWeight: integer("probability_weight").notNull(),
  weeklyLimit: integer("weekly_limit"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});

export const userRewards = sqliteTable("user_rewards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  rewardId: integer("reward_id").notNull().references(() => wheelRewards.id),
  code: text("code").notNull(),
  status: text("status", { enum: ["ACTIVE", "USED", "EXPIRED"] }).notNull().default("ACTIVE"),
  expiresAt: text("expires_at").notNull(),
  createdAt: timestamp("created_at"),
}, (t) => [uniqueIndex("idx_user_rewards_code").on(t.code), index("idx_user_rewards_user_status").on(t.userId, t.status)]);

export const supportTickets = sqliteTable("support_tickets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  category: text("category", { enum: ["TICKET", "PAYMENT", "ACCOUNT", "REFUND", "OTHER"] }).notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status", { enum: ["OPEN", "IN_REVIEW", "WAITING_USER", "RESOLVED"] }).notNull().default("OPEN"),
  assignedTo: integer("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
}, (t) => [index("idx_support_status_created").on(t.status, t.createdAt), index("idx_support_user").on(t.userId)]);

export const moderationReports = sqliteTable("moderation_reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reporterId: integer("reporter_id").notNull().references(() => users.id),
  targetType: text("target_type", { enum: ["USER", "EVENT", "STORY", "COMMENT", "VENUE"] }).notNull(),
  targetId: integer("target_id").notNull(),
  reason: text("reason", { enum: ["SPAM", "ABUSE", "MISLEADING", "FRAUD", "OTHER"] }).notNull(),
  detail: text("detail"),
  status: text("status", { enum: ["OPEN", "IN_REVIEW", "ACTIONED", "DISMISSED"] }).notNull().default("OPEN"),
  createdAt: timestamp("created_at"),
}, (t) => [index("idx_moderation_status_created").on(t.status, t.createdAt), index("idx_moderation_target").on(t.targetType, t.targetId)]);

export const payouts = sqliteTable("payouts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizerId: integer("organizer_id").notNull().references(() => organizers.id),
  periodStart: text("period_start").notNull(),
  periodEnd: text("period_end").notNull(),
  grossAmount: integer("gross_amount").notNull(),
  commissionAmount: integer("commission_amount").notNull(),
  paymentFees: integer("payment_fees").notNull().default(0),
  refundAmount: integer("refund_amount").notNull().default(0),
  netAmount: integer("net_amount").notNull(),
  status: text("status", { enum: ["PENDING", "APPROVED", "PAID", "HELD"] }).notNull().default("PENDING"),
  paidAt: text("paid_at"),
}, (t) => [index("idx_payouts_organizer_status").on(t.organizerId, t.status)]);

export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  actorUserId: integer("actor_user_id").references(() => users.id),
  category: text("category", { enum: ["AUTH", "USER", "FINANCE", "ADMIN", "SECURITY", "TICKET"] }).notNull(),
  action: text("action").notNull(),
  targetType: text("target_type"),
  targetId: text("target_id"),
  ipHash: text("ip_hash"),
  metadata: text("metadata", { mode: "json" }),
  createdAt: timestamp("created_at"),
}, (t) => [index("idx_audit_category_created").on(t.category, t.createdAt), index("idx_audit_actor_created").on(t.actorUserId, t.createdAt)]);
