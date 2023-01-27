#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	create user mmc createdb encrypted password '${MMC_PASSWORD}';
    create database mmc with owner = mmc;
    create database mmc_shadow with owner = mmc;
EOSQL
