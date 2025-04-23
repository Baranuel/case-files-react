FROM postgres:16.2-alpine

COPY ./seed.sql /docker-entrypoint-initdb.d/seed.sql

RUN chmod +x /docker-entrypoint-initdb.d/seed.sql


