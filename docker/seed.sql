CREATE DATABASE zstart;
CREATE DATABASE zstart_cvr;
CREATE DATABASE zstart_cdb;

CREATE ROLE postgres WITH LOGIN SUPERUSER PASSWORD 'password';

\c zstart;

CREATE TABLE "content" (
  "id" VARCHAR PRIMARY KEY,
  "title" VARCHAR,
  "notes" TEXT,
  "victim" BOOLEAN NOT NULL DEFAULT FALSE,
  "timeOfDeath" TIMESTAMP
);

CREATE TABLE "user" (
  "id" VARCHAR PRIMARY KEY,
  "tier" VARCHAR NOT NULL CHECK ("tier" IN ('free', 'paid')) DEFAULT 'free',
  "name" VARCHAR,
  "imageUrl" VARCHAR,
  "maxBoards" INTEGER NOT NULL DEFAULT 2,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "board" (
  "id" VARCHAR PRIMARY KEY,
  "title" VARCHAR NOT NULL,
  "creatorId" VARCHAR NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "collaboration" (
  "id" VARCHAR PRIMARY KEY,
  "boardCreatorId" VARCHAR NOT NULL,
  "boardId" VARCHAR NOT NULL,
  "userId" VARCHAR NOT NULL,
  "status" VARCHAR NOT NULL CHECK ("status" IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE "element" (
  "id" VARCHAR PRIMARY KEY,
  "type" VARCHAR NOT NULL CHECK ("type" IN ('person', 'location', 'line', 'note')),
  "position" JSONB NOT NULL,
  "imageUrl" VARCHAR,
  "layer" INTEGER NOT NULL,
  "boardId" VARCHAR,
  "contentId" VARCHAR,
  "creatorId" VARCHAR,
  FOREIGN KEY ("contentId") REFERENCES "content"("id") ON DELETE CASCADE,
  FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE
);

