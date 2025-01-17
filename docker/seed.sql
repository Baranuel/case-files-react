CREATE DATABASE zstart;
CREATE DATABASE zstart_cvr;
CREATE DATABASE zstart_cdb;

CREATE ROLE postgres WITH LOGIN SUPERUSER PASSWORD 'password';

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
  "boardId" VARCHAR,
  "contentId" VARCHAR,
  FOREIGN KEY ("contentId") REFERENCES "content"("id")
);
