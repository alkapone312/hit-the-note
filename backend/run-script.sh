#!/bin/bash

DATABASE_PATH="/var/www/storage/database/database.sqlite"

if [ ! -f "$DATABASE_PATH" ]; then
    echo "Baza danych nie istnieje. Wykonywanie migracji..."
    mkdir -p /var/www/storage/database
    touch "$DATABASE_PATH"
    php artisan migrate
else
    echo "Baza danych już istnieje. Migracja nie jest potrzebna."
fi

apache2ctl -D FOREGROUND