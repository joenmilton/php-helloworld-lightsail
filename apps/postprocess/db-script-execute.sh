#!/bin/bash

# Read database password
DB_PASSWORD=$(cat /home/bitnami/bitnami_application_password)

# Check if deals database exists
DB_EXISTS=$(mysql -u root -p"$DB_PASSWORD" -e "SHOW DATABASES LIKE 'deals';" | grep deals)

if [ -z "$DB_EXISTS" ]; then
    echo "Creating deals database..."
    mysql -u root -p"$DB_PASSWORD" -e "CREATE DATABASE deals;"
fi

# Import deals.sql if it exists
if [ -f "/opt/bitnami/apache/apps/db/deals.sql" ]; then
    echo "Importing deals.sql..."
    mysql -u root -p"$DB_PASSWORD" deals < /opt/bitnami/apache/apps/db/deals.sql
    echo "Database import completed."
else
    echo "deals.sql not found, skipping import."
fi