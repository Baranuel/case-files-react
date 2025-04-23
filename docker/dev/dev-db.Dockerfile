FROM postgres:16.2-alpine

COPY ./docker/dev/seed.sql /docker-entrypoint-initdb.d/seed.sql


