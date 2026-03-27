import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_cta_buttons_variant" AS ENUM('outline', 'solid');
  CREATE TYPE "public"."enum_pages_blocks_social_accounts_platform" AS ENUM('instagram', 'facebook', 'linkedin', 'tiktok', 'twitter', 'youtube');
  CREATE TABLE "pages_blocks_hero_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"variant" "enum_pages_blocks_hero_cta_buttons_variant" DEFAULT 'outline'
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar NOT NULL,
  	"tagline" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_ingredients_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_ingredients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_id" varchar DEFAULT 'wat-is-een-johnnie',
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_photo_strip_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_photo_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_statement_banner_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_statement_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar NOT NULL,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_locations_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"address" varchar,
  	"city" varchar,
  	"lat" numeric,
  	"lng" numeric
  );
  
  CREATE TABLE "pages_blocks_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_id" varchar DEFAULT 'vind-een-frituur',
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_frituurbakker_signup" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_id" varchar DEFAULT 'over-frituurbakkers',
  	"title" varchar NOT NULL,
  	"description" jsonb,
  	"image_id" integer,
  	"cta_label" varchar DEFAULT 'Ik wil een Johnny schrijven',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_social_accounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_pages_blocks_social_accounts_platform" NOT NULL,
  	"handle" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_id" varchar DEFAULT 'social',
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "frituur_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"frituur_name" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"address" varchar,
  	"postcode" varchar,
  	"city" varchar,
  	"gps_lat" numeric,
  	"gps_lng" numeric,
  	"phone" varchar,
  	"email" varchar NOT NULL,
  	"visible" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_nav_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"nav_cta_label" varchar,
  	"nav_cta_href" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "media" ALTER COLUMN "prefix" SET DEFAULT 'johnny';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "frituur_applications_id" integer;
  ALTER TABLE "pages_blocks_hero_cta_buttons" ADD CONSTRAINT "pages_blocks_hero_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_ingredients_items" ADD CONSTRAINT "pages_blocks_ingredients_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ingredients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_ingredients" ADD CONSTRAINT "pages_blocks_ingredients_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_ingredients" ADD CONSTRAINT "pages_blocks_ingredients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_photo_strip_photos" ADD CONSTRAINT "pages_blocks_photo_strip_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_photo_strip_photos" ADD CONSTRAINT "pages_blocks_photo_strip_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_photo_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_photo_strip" ADD CONSTRAINT "pages_blocks_photo_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_statement_banner_cta_links" ADD CONSTRAINT "pages_blocks_statement_banner_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_statement_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_statement_banner" ADD CONSTRAINT "pages_blocks_statement_banner_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_statement_banner" ADD CONSTRAINT "pages_blocks_statement_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_locations_locations" ADD CONSTRAINT "pages_blocks_locations_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_locations" ADD CONSTRAINT "pages_blocks_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_frituurbakker_signup" ADD CONSTRAINT "pages_blocks_frituurbakker_signup_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_frituurbakker_signup" ADD CONSTRAINT "pages_blocks_frituurbakker_signup_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_social_accounts" ADD CONSTRAINT "pages_blocks_social_accounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_social" ADD CONSTRAINT "pages_blocks_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_nav_links" ADD CONSTRAINT "site_settings_nav_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_links" ADD CONSTRAINT "site_settings_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_cta_buttons_order_idx" ON "pages_blocks_hero_cta_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_cta_buttons_parent_id_idx" ON "pages_blocks_hero_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_ingredients_items_order_idx" ON "pages_blocks_ingredients_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_ingredients_items_parent_id_idx" ON "pages_blocks_ingredients_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_ingredients_order_idx" ON "pages_blocks_ingredients" USING btree ("_order");
  CREATE INDEX "pages_blocks_ingredients_parent_id_idx" ON "pages_blocks_ingredients" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_ingredients_path_idx" ON "pages_blocks_ingredients" USING btree ("_path");
  CREATE INDEX "pages_blocks_ingredients_image_idx" ON "pages_blocks_ingredients" USING btree ("image_id");
  CREATE INDEX "pages_blocks_photo_strip_photos_order_idx" ON "pages_blocks_photo_strip_photos" USING btree ("_order");
  CREATE INDEX "pages_blocks_photo_strip_photos_parent_id_idx" ON "pages_blocks_photo_strip_photos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_photo_strip_photos_image_idx" ON "pages_blocks_photo_strip_photos" USING btree ("image_id");
  CREATE INDEX "pages_blocks_photo_strip_order_idx" ON "pages_blocks_photo_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_photo_strip_parent_id_idx" ON "pages_blocks_photo_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_photo_strip_path_idx" ON "pages_blocks_photo_strip" USING btree ("_path");
  CREATE INDEX "pages_blocks_statement_banner_cta_links_order_idx" ON "pages_blocks_statement_banner_cta_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_statement_banner_cta_links_parent_id_idx" ON "pages_blocks_statement_banner_cta_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_statement_banner_order_idx" ON "pages_blocks_statement_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_statement_banner_parent_id_idx" ON "pages_blocks_statement_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_statement_banner_path_idx" ON "pages_blocks_statement_banner" USING btree ("_path");
  CREATE INDEX "pages_blocks_statement_banner_image_idx" ON "pages_blocks_statement_banner" USING btree ("image_id");
  CREATE INDEX "pages_blocks_locations_locations_order_idx" ON "pages_blocks_locations_locations" USING btree ("_order");
  CREATE INDEX "pages_blocks_locations_locations_parent_id_idx" ON "pages_blocks_locations_locations" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_locations_order_idx" ON "pages_blocks_locations" USING btree ("_order");
  CREATE INDEX "pages_blocks_locations_parent_id_idx" ON "pages_blocks_locations" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_locations_path_idx" ON "pages_blocks_locations" USING btree ("_path");
  CREATE INDEX "pages_blocks_frituurbakker_signup_order_idx" ON "pages_blocks_frituurbakker_signup" USING btree ("_order");
  CREATE INDEX "pages_blocks_frituurbakker_signup_parent_id_idx" ON "pages_blocks_frituurbakker_signup" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_frituurbakker_signup_path_idx" ON "pages_blocks_frituurbakker_signup" USING btree ("_path");
  CREATE INDEX "pages_blocks_frituurbakker_signup_image_idx" ON "pages_blocks_frituurbakker_signup" USING btree ("image_id");
  CREATE INDEX "pages_blocks_social_accounts_order_idx" ON "pages_blocks_social_accounts" USING btree ("_order");
  CREATE INDEX "pages_blocks_social_accounts_parent_id_idx" ON "pages_blocks_social_accounts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_social_order_idx" ON "pages_blocks_social" USING btree ("_order");
  CREATE INDEX "pages_blocks_social_parent_id_idx" ON "pages_blocks_social" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_social_path_idx" ON "pages_blocks_social" USING btree ("_path");
  CREATE INDEX "frituur_applications_updated_at_idx" ON "frituur_applications" USING btree ("updated_at");
  CREATE INDEX "frituur_applications_created_at_idx" ON "frituur_applications" USING btree ("created_at");
  CREATE INDEX "site_settings_nav_links_order_idx" ON "site_settings_nav_links" USING btree ("_order");
  CREATE INDEX "site_settings_nav_links_parent_id_idx" ON "site_settings_nav_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_links_order_idx" ON "site_settings_footer_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_links_parent_id_idx" ON "site_settings_footer_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_frituur_applications_fk" FOREIGN KEY ("frituur_applications_id") REFERENCES "public"."frituur_applications"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_frituur_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("frituur_applications_id");
  ALTER TABLE "pages" DROP COLUMN "content";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero_cta_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_ingredients_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_ingredients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_photo_strip_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_photo_strip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_statement_banner_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_statement_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_locations_locations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_locations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_frituurbakker_signup" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_social_accounts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_social" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "frituur_applications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_nav_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_footer_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_hero_cta_buttons" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_ingredients_items" CASCADE;
  DROP TABLE "pages_blocks_ingredients" CASCADE;
  DROP TABLE "pages_blocks_photo_strip_photos" CASCADE;
  DROP TABLE "pages_blocks_photo_strip" CASCADE;
  DROP TABLE "pages_blocks_statement_banner_cta_links" CASCADE;
  DROP TABLE "pages_blocks_statement_banner" CASCADE;
  DROP TABLE "pages_blocks_locations_locations" CASCADE;
  DROP TABLE "pages_blocks_locations" CASCADE;
  DROP TABLE "pages_blocks_frituurbakker_signup" CASCADE;
  DROP TABLE "pages_blocks_social_accounts" CASCADE;
  DROP TABLE "pages_blocks_social" CASCADE;
  DROP TABLE "frituur_applications" CASCADE;
  DROP TABLE "site_settings_nav_links" CASCADE;
  DROP TABLE "site_settings_footer_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_frituur_applications_fk";
  
  DROP INDEX "payload_locked_documents_rels_frituur_applications_id_idx";
  ALTER TABLE "pages" ADD COLUMN "content" jsonb;
  ALTER TABLE "media" ALTER COLUMN "prefix" DROP DEFAULT;
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "frituur_applications_id";
  DROP TYPE "public"."enum_pages_blocks_hero_cta_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_social_accounts_platform";`)
}
