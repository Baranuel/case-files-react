CREATE DATABASE zstart;
CREATE DATABASE zstart_cvr;
CREATE DATABASE zstart_cdb;

\c zstart;

CREATE TABLE "content" (
  "id" VARCHAR PRIMARY KEY,
  "title" VARCHAR NOT NULL,
  "content" VARCHAR NOT NULL
);

CREATE TABLE "element" (
  "id" VARCHAR PRIMARY KEY,
  "type" VARCHAR NOT NULL CHECK ("type" IN ('person', 'location', 'line')),
  "position" JSONB NOT NULL,
  "imageUrl" VARCHAR,
  "layer" INTEGER NOT NULL,
  "contentId" VARCHAR,
  FOREIGN KEY ("contentId") REFERENCES "content"("id")
);
