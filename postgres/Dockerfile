FROM postgres:16-alpine

ENV POSTGRES_USER=counter
ENV POSTGRES_PASSWORD=counter
ENV POSTGRES_DB=counter

COPY init.sql /docker-entrypoint-initdb.d/01-init.sql
