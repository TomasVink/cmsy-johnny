import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_logo_id_media_id_fk";
  
  DROP INDEX "site_settings_logo_idx";
  ALTER TABLE "site_settings_locales" ADD COLUMN "logo_id" integer;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_logo_idx" ON "site_settings_locales" USING btree ("logo_id","_locale");
  ALTER TABLE "site_settings" DROP COLUMN "logo_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings_locales" DROP CONSTRAINT "site_settings_locales_logo_id_media_id_fk";
  
  DROP INDEX "site_settings_logo_idx";
  ALTER TABLE "site_settings" ADD COLUMN "logo_id" integer;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  ALTER TABLE "site_settings_locales" DROP COLUMN "logo_id";`)
}
