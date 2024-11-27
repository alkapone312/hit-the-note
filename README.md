# Hit the Note 🎶

**Hit the Note** is an engaging and fun game where players use their voice to match the notes of popular songs. Perfect for aspiring singers, music enthusiasts, or anyone looking to have a great time!

---

## Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Building the Project](#building-the-project)
- [Generating Documentation](#generating-documentation)
- [Running the Project with Docker Compose](#running-the-project-with-docker-compose)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- 🎤 **Voice Recognition**: Sing and match notes in real-time.
- 🎵 **Popular Songs**: Play with a curated collection of your favorite tracks.
- 📊 **Score Tracking**: Compete with friends and aim for the high score.
- 🌟 **Interactive UI**: An immersive and user-friendly experience.

---

## Requirements
- Node.js v20+
- PHP 8.2+
- Composer
- SQLite 
- Docker
- Cypress
- Vite
- Vue
- Laravel

---

## Development
1. Clone the repository:
   ```bash
   git clone https://github.com/alkapone312/hit-the-note.git
   cd hit-the-note
   ```
2. Run docker compose:
   ```bash
   docker compose up
   ```
3. Check application under:
Application:
   ```
   http://localhost:3000
   ```
Backend:
   ```
   http://localhost:8080
   ```

---

## Building the Project

1. Build production ready container: 
```bash
./build-prod-container.sh
```
2. Load container to docker
```bash
docker load < dist/hit-the-note.tar
```
3. Run the container
```bash
docker run -p 8080:80 jakub/hit-the-note:1.0.0
```
You can mount the database on local file system for it to be persisted

```bash
docker run -p 8080:80 -v ./storage:/var/www/storage jakub/hit-the-note:1.0.0
```
---

## Entering containers

### Backend
```bash
./php.sh
```


### Application
```bash
./node.sh
```

---

## Add new track

```bash
docker cp ./some-track.htn CONTAINER_ID:/tmp/some-track.htn
docker exec CONTAINER_ID php artisan note-track:store "Some Track" /tmp/some-track.htn
```

## Remove track

## Generating Documentation
To generate project documentation, use the following commands:
```bash
./node.sh
npm run docs
```

---

## Contributing
We welcome contributions from the community! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed description.

---

## License
This project is licensed under the [MIT License](LICENSE).
