import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Step 1: drop old constraint and index
  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero" DROP CONSTRAINT "pages_blocks_hero_headline_id_media_id_fk";
    DROP INDEX "pages_blocks_hero_headline_idx";
  `)

  // Step 2: add new localized columns as nullable so existing rows don't violate NOT NULL
  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero_cta_buttons_locales" ADD COLUMN "href" varchar;
    ALTER TABLE "pages_blocks_hero_locales" ADD COLUMN "headline_id" integer;
    ALTER TABLE "site_settings_nav_links_locales" ADD COLUMN "href" varchar;
    ALTER TABLE "site_settings_footer_links_locales" ADD COLUMN "href" varchar;
    ALTER TABLE "site_settings_locales" ADD COLUMN "nav_cta_href" varchar;
  `)

  // Step 3: copy data from the non-localized parent columns into the locale rows
  await db.execute(sql`
    UPDATE "pages_blocks_hero_locales" l
    SET "headline_id" = h."headline_id"
    FROM "pages_blocks_hero" h
    WHERE l."_parent_id" = h."id";

    UPDATE "pages_blocks_hero_cta_buttons_locales" l
    SET "href" = b."href"
    FROM "pages_blocks_hero_cta_buttons" b
    WHERE l."_parent_id" = b."id";

    UPDATE "site_settings_nav_links_locales" l
    SET "href" = nl."href"
    FROM "site_settings_nav_links" nl
    WHERE l."_parent_id" = nl."id";

    UPDATE "site_settings_footer_links_locales" l
    SET "href" = fl."href"
    FROM "site_settings_footer_links" fl
    WHERE l."_parent_id" = fl."id";

    UPDATE "site_settings_locales" l
    SET "nav_cta_href" = s."nav_cta_href"
    FROM "site_settings" s
    WHERE l."_parent_id" = s."id";
  `)

  // Step 4: add FK constraint and index on the new localized column
  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero_locales" ADD CONSTRAINT "pages_blocks_hero_locales_headline_id_media_id_fk" FOREIGN KEY ("headline_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX "pages_blocks_hero_headline_idx" ON "pages_blocks_hero_locales" USING btree ("headline_id","_locale");
  `)

  // Step 5: drop the old non-localized columns
  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero_cta_buttons" DROP COLUMN "href";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN "headline_id";
    ALTER TABLE "site_settings_nav_links" DROP COLUMN "href";
    ALTER TABLE "site_settings_footer_links" DROP COLUMN "href";
    ALTER TABLE "site_settings" DROP COLUMN "nav_cta_href";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero_locales" DROP CONSTRAINT "pages_blocks_hero_locales_headline_id_media_id_fk";
  
  DROP INDEX "pages_blocks_hero_headline_idx";
  ALTER TABLE "pages_blocks_hero_cta_buttons" ADD COLUMN "href" varchar NOT NULL;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "headline_id" integer NOT NULL;
  ALTER TABLE "site_settings_nav_links" ADD COLUMN "href" varchar NOT NULL;
  ALTER TABLE "site_settings_footer_links" ADD COLUMN "href" varchar NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "nav_cta_href" varchar;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_headline_id_media_id_fk" FOREIGN KEY ("headline_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_headline_idx" ON "pages_blocks_hero" USING btree ("headline_id");
  ALTER TABLE "pages_blocks_hero_cta_buttons_locales" DROP COLUMN "href";
  ALTER TABLE "pages_blocks_hero_locales" DROP COLUMN "headline_id";
  ALTER TABLE "site_settings_nav_links_locales" DROP COLUMN "href";
  ALTER TABLE "site_settings_footer_links_locales" DROP COLUMN "href";
  ALTER TABLE "site_settings_locales" DROP COLUMN "nav_cta_href";`)
}
