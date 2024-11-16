# Base image for backend (Laravel)
FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    unzip \
    git \
    curl \
    libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN a2enmod rewrite

RUN useradd -ms /bin/bash dev
USER dev