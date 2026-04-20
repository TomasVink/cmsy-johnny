import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_frituur_applications_url_type" AS ENUM('website', 'instagram', 'facebook', 'tiktok');
  CREATE TABLE "pages_blocks_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_map_locales" (
  	"section_id" varchar,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "frituur_applications" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "frituur_applications" ALTER COLUMN "email" DROP NOT NULL;
  ALTER TABLE "imports" ALTER COLUMN "collection_slug" SET DEFAULT 'frituur-applications';
  ALTER TABLE "frituur_applications" ADD COLUMN "url_type" "enum_frituur_applications_url_type";
  ALTER TABLE "frituur_applications" ADD COLUMN "url" varchar;
  ALTER TABLE "frituur_applications" ADD COLUMN "handle" varchar;
  ALTER TABLE "pages_blocks_map" ADD CONSTRAINT "pages_blocks_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_map_locales" ADD CONSTRAINT "pages_blocks_map_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_map"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_map_order_idx" ON "pages_blocks_map" USING btree ("_order");
  CREATE INDEX "pages_blocks_map_parent_id_idx" ON "pages_blocks_map" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_map_path_idx" ON "pages_blocks_map" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_map_locales_locale_parent_id_unique" ON "pages_blocks_map_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_map" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_map_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_map" CASCADE;
  DROP TABLE "pages_blocks_map_locales" CASCADE;
  ALTER TABLE "frituur_applications" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "frituur_applications" ALTER COLUMN "email" SET NOT NULL;
  ALTER TABLE "imports" ALTER COLUMN "collection_slug" DROP DEFAULT;
  ALTER TABLE "frituur_applications" DROP COLUMN "url_type";
  ALTER TABLE "frituur_applications" DROP COLUMN "url";
  ALTER TABLE "frituur_applications" DROP COLUMN "handle";
  DROP TYPE "public"."enum_frituur_applications_url_type";`)
}
