CREATE DATABASE zstart;
CREATE DATABASE zstart_cvr;
CREATE DATABASE zstart_cdb;

\c zstart;

CREATE TABLE "element" (
  "id" VARCHAR PRIMARY KEY,
  "name" VARCHAR NOT NULL
);



INSERT INTO "user" (id, name) VALUES ('ycD76wW4R2', 'Aaron')