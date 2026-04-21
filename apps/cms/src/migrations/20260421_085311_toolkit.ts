import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_toolkit_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_blocks_toolkit_items_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_toolkit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_toolkit_locales" (
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "pages_blocks_signup" ADD COLUMN "thank_you_link" varchar;
  ALTER TABLE "pages_blocks_signup" ADD COLUMN "thank_you_link_text" varchar;
  ALTER TABLE "pages_blocks_toolkit_items" ADD CONSTRAINT "pages_blocks_toolkit_items_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_toolkit_items" ADD CONSTRAINT "pages_blocks_toolkit_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_toolkit"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_toolkit_items_locales" ADD CONSTRAINT "pages_blocks_toolkit_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_toolkit_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_toolkit" ADD CONSTRAINT "pages_blocks_toolkit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_toolkit_locales" ADD CONSTRAINT "pages_blocks_toolkit_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_toolkit"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_toolkit_items_order_idx" ON "pages_blocks_toolkit_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_toolkit_items_parent_id_idx" ON "pages_blocks_toolkit_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_toolkit_items_file_idx" ON "pages_blocks_toolkit_items" USING btree ("file_id");
  CREATE UNIQUE INDEX "pages_blocks_toolkit_items_locales_locale_parent_id_unique" ON "pages_blocks_toolkit_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_toolkit_order_idx" ON "pages_blocks_toolkit" USING btree ("_order");
  CREATE INDEX "pages_blocks_toolkit_parent_id_idx" ON "pages_blocks_toolkit" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_toolkit_path_idx" ON "pages_blocks_toolkit" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_toolkit_locales_locale_parent_id_unique" ON "pages_blocks_toolkit_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_toolkit_items" CASCADE;
  DROP TABLE "pages_blocks_toolkit_items_locales" CASCADE;
  DROP TABLE "pages_blocks_toolkit" CASCADE;
  DROP TABLE "pages_blocks_toolkit_locales" CASCADE;
  ALTER TABLE "pages_blocks_signup" DROP COLUMN "thank_you_link";
  ALTER TABLE "pages_blocks_signup" DROP COLUMN "thank_you_link_text";`)
}
