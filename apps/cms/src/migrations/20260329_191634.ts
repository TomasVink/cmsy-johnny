import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_social_accounts_locales" (
  	"handle" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "pages_blocks_social_accounts_locales" ADD CONSTRAINT "pages_blocks_social_accounts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_social_accounts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "pages_blocks_social_accounts_locales_locale_parent_id_unique" ON "pages_blocks_social_accounts_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "pages_blocks_social_accounts" DROP COLUMN "handle";
  ALTER TABLE "pages_blocks_social_accounts" DROP COLUMN "url";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_social_accounts_locales" CASCADE;
  ALTER TABLE "pages_blocks_social_accounts" ADD COLUMN "handle" varchar NOT NULL;
  ALTER TABLE "pages_blocks_social_accounts" ADD COLUMN "url" varchar NOT NULL;`)
}
