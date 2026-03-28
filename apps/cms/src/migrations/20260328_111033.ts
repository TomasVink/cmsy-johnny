import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('nl', 'fr');
  CREATE TYPE "public"."enum_exports_locale" AS ENUM('all', 'nl', 'fr');
  CREATE TABLE "pages_blocks_hero_cta_buttons_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero_locales" (
  	"tagline" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_ingredients_items_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_ingredients_locales" (
  	"section_id" varchar,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_photo_strip_photos_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_statement_banner_locales" (
  	"headline" varchar NOT NULL,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_locations_locations_locales" (
  	"name" varchar NOT NULL,
  	"address" varchar,
  	"city" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_locations_locales" (
  	"section_id" varchar,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_signup_locales" (
  	"section_id" varchar,
  	"title" varchar NOT NULL,
  	"subtitle" varchar NOT NULL,
  	"description" varchar,
  	"cta_label" varchar,
  	"disclaimer" varchar,
  	"thank_you" varchar NOT NULL,
  	"labels_frituur_name" varchar,
  	"labels_name" varchar,
  	"labels_address" varchar,
  	"labels_postcode" varchar,
  	"labels_city" varchar,
  	"labels_phone" varchar,
  	"labels_email" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_social_locales" (
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_ticker_banner_items_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_polaroids_photos_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_nav_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_footer_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_locales" (
  	"nav_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "exports" ADD COLUMN "locale" "enum_exports_locale" DEFAULT 'all';
  ALTER TABLE "pages_blocks_hero_cta_buttons_locales" ADD CONSTRAINT "pages_blocks_hero_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_locales" ADD CONSTRAINT "pages_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_ingredients_items_locales" ADD CONSTRAINT "pages_blocks_ingredients_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ingredients_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_ingredients_locales" ADD CONSTRAINT "pages_blocks_ingredients_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ingredients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_photo_strip_photos_locales" ADD CONSTRAINT "pages_blocks_photo_strip_photos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_photo_strip_photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_statement_banner_locales" ADD CONSTRAINT "pages_blocks_statement_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_statement_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_locations_locations_locales" ADD CONSTRAINT "pages_blocks_locations_locations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_locations_locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_locations_locales" ADD CONSTRAINT "pages_blocks_locations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_signup_locales" ADD CONSTRAINT "pages_blocks_signup_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_signup"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_social_locales" ADD CONSTRAINT "pages_blocks_social_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_ticker_banner_items_locales" ADD CONSTRAINT "pages_blocks_ticker_banner_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ticker_banner_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_polaroids_photos_locales" ADD CONSTRAINT "pages_blocks_polaroids_photos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_polaroids_photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_nav_links_locales" ADD CONSTRAINT "site_settings_nav_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_nav_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_links_locales" ADD CONSTRAINT "site_settings_footer_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_footer_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "pages_blocks_hero_cta_buttons_locales_locale_parent_id_uniqu" ON "pages_blocks_hero_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_locales_locale_parent_id_unique" ON "pages_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_ingredients_items_locales_locale_parent_id_uniq" ON "pages_blocks_ingredients_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_ingredients_locales_locale_parent_id_unique" ON "pages_blocks_ingredients_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_photo_strip_photos_locales_locale_parent_id_uni" ON "pages_blocks_photo_strip_photos_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_statement_banner_locales_locale_parent_id_uniqu" ON "pages_blocks_statement_banner_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_locations_locations_locales_locale_parent_id_un" ON "pages_blocks_locations_locations_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_locations_locales_locale_parent_id_unique" ON "pages_blocks_locations_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_signup_locales_locale_parent_id_unique" ON "pages_blocks_signup_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_social_locales_locale_parent_id_unique" ON "pages_blocks_social_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_ticker_banner_items_locales_locale_parent_id_un" ON "pages_blocks_ticker_banner_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_polaroids_photos_locales_locale_parent_id_uniqu" ON "pages_blocks_polaroids_photos_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_nav_links_locales_locale_parent_id_unique" ON "site_settings_nav_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_footer_links_locales_locale_parent_id_unique" ON "site_settings_footer_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "pages_blocks_hero_cta_buttons" DROP COLUMN "label";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "tagline";
  ALTER TABLE "pages_blocks_ingredients_items" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_ingredients_items" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_ingredients" DROP COLUMN "section_id";
  ALTER TABLE "pages_blocks_ingredients" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_ingredients" DROP COLUMN "subtitle";
  ALTER TABLE "pages_blocks_ingredients" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_photo_strip_photos" DROP COLUMN "caption";
  ALTER TABLE "pages_blocks_statement_banner" DROP COLUMN "headline";
  ALTER TABLE "pages_blocks_statement_banner" DROP COLUMN "subtitle";
  ALTER TABLE "pages_blocks_locations_locations" DROP COLUMN "name";
  ALTER TABLE "pages_blocks_locations_locations" DROP COLUMN "address";
  ALTER TABLE "pages_blocks_locations_locations" DROP COLUMN "city";
  ALTER TABLE "pages_blocks_locations" DROP COLUMN "section_id";
  ALTER TABLE "pages_blocks_locations" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_locations" DROP COLUMN "subtitle";
  ALTER TABLE "pages_blocks_signup" DROP COLUMN "section_id";
  ALTER TABLE "pages_blocks_signup" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_signup" DROP COLUMN "subtitle";
  ALTER TABLE "pages_blocks_signup" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_signup" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_signup" DROP COLUMN "disclaimer";
  ALTER TABLE "pages_blocks_signup" DROP COLUMN "thank_you";
  ALTER TABLE "pages_blocks_social" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_social" DROP COLUMN "subtitle";
  ALTER TABLE "pages_blocks_social" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_ticker_banner_items" DROP COLUMN "text";
  ALTER TABLE "pages_blocks_polaroids_photos" DROP COLUMN "title";
  ALTER TABLE "pages" DROP COLUMN "title";
  ALTER TABLE "pages" DROP COLUMN "seo_title";
  ALTER TABLE "pages" DROP COLUMN "seo_description";
  ALTER TABLE "site_settings_nav_links" DROP COLUMN "label";
  ALTER TABLE "site_settings_footer_links" DROP COLUMN "label";
  ALTER TABLE "site_settings" DROP COLUMN "nav_cta_label";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_cta_buttons_locales" CASCADE;
  DROP TABLE "pages_blocks_hero_locales" CASCADE;
  DROP TABLE "pages_blocks_ingredients_items_locales" CASCADE;
  DROP TABLE "pages_blocks_ingredients_locales" CASCADE;
  DROP TABLE "pages_blocks_photo_strip_photos_locales" CASCADE;
  DROP TABLE "pages_blocks_statement_banner_locales" CASCADE;
  DROP TABLE "pages_blocks_locations_locations_locales" CASCADE;
  DROP TABLE "pages_blocks_locations_locales" CASCADE;
  DROP TABLE "pages_blocks_signup_locales" CASCADE;
  DROP TABLE "pages_blocks_social_locales" CASCADE;
  DROP TABLE "pages_blocks_ticker_banner_items_locales" CASCADE;
  DROP TABLE "pages_blocks_polaroids_photos_locales" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "site_settings_nav_links_locales" CASCADE;
  DROP TABLE "site_settings_footer_links_locales" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  ALTER TABLE "pages_blocks_hero_cta_buttons" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "tagline" varchar;
  ALTER TABLE "pages_blocks_ingredients_items" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "pages_blocks_ingredients_items" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_ingredients" ADD COLUMN "section_id" varchar DEFAULT 'wat-is-een-johnnie';
  ALTER TABLE "pages_blocks_ingredients" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "pages_blocks_ingredients" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "pages_blocks_ingredients" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_photo_strip_photos" ADD COLUMN "caption" varchar;
  ALTER TABLE "pages_blocks_statement_banner" ADD COLUMN "headline" varchar NOT NULL;
  ALTER TABLE "pages_blocks_statement_banner" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "pages_blocks_locations_locations" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "pages_blocks_locations_locations" ADD COLUMN "address" varchar;
  ALTER TABLE "pages_blocks_locations_locations" ADD COLUMN "city" varchar;
  ALTER TABLE "pages_blocks_locations" ADD COLUMN "section_id" varchar DEFAULT 'vind-een-frituur';
  ALTER TABLE "pages_blocks_locations" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "pages_blocks_locations" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "pages_blocks_signup" ADD COLUMN "section_id" varchar DEFAULT 'sign-up';
  ALTER TABLE "pages_blocks_signup" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "pages_blocks_signup" ADD COLUMN "subtitle" varchar NOT NULL;
  ALTER TABLE "pages_blocks_signup" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_signup" ADD COLUMN "cta_label" varchar DEFAULT 'Ik wil een Johnny serveren';
  ALTER TABLE "pages_blocks_signup" ADD COLUMN "disclaimer" varchar DEFAULT 'Geen verplichtingen. We contacteren je snel.';
  ALTER TABLE "pages_blocks_signup" ADD COLUMN "thank_you" varchar DEFAULT 'Bedankt. We nemen snel contact met je op.' NOT NULL;
  ALTER TABLE "pages_blocks_social" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "pages_blocks_social" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "pages_blocks_social" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_ticker_banner_items" ADD COLUMN "text" varchar NOT NULL;
  ALTER TABLE "pages_blocks_polaroids_photos" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "pages" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "pages" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "site_settings_nav_links" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "site_settings_footer_links" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "nav_cta_label" varchar;
  ALTER TABLE "exports" DROP COLUMN "locale";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_exports_locale";`)
}
