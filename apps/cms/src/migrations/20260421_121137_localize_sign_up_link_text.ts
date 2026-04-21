import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_signup_locales" ADD COLUMN "thank_you_link_text" varchar;
  ALTER TABLE "pages_blocks_signup" DROP COLUMN "thank_you_link_text";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_signup" ADD COLUMN "thank_you_link_text" varchar;
  ALTER TABLE "pages_blocks_signup_locales" DROP COLUMN "thank_you_link_text";`)
}
